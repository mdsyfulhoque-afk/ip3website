import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Booking from '../models/Booking.js';
import { requireAdmin } from '../lib/auth.js';
import { asyncHandler, httpError, isValidId, sanitizePayload, isEmail } from '../lib/helpers.js';
import { isDBConnected } from '../lib/db.js';
import { expiryFor, purgeExpired } from '../lib/retention.js';
import {
  addInMemoryBooking,
  getInMemoryBookings,
  updateInMemoryBooking,
} from '../lib/inMemoryStore.js';

/**
 * Consultation bookings.
 *
 * A visitor requests a slot: the booking is stored as `pending` and holds the slot so nobody else can take it.
 * An admin then confirms it, which generates the meeting link, or declines it, which frees the slot.
 * Bookings are deleted RETENTION_DAYS after the meeting (see server/lib/retention.js).
 */
const router = Router();

const bookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many booking attempts. Please try again later.', code: 'RATE_LIMITED' },
});

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MEETING_MINUTES = Number(process.env.MEETING_MINUTES || 45);

/**
 * The meeting link for a confirmed booking. If MEETING_LINK is set (a standing room), every booking uses it.
 * Otherwise each booking gets its own Jitsi Meet room: free, no account needed, and unguessable because the
 * name ends in 12 random characters. MEETING_BASE_URL can point at another Jitsi server.
 */
function meetingLinkFor(bookingId) {
  if (process.env.MEETING_LINK) return process.env.MEETING_LINK;
  const base = (process.env.MEETING_BASE_URL || 'https://meet.jit.si').replace(/\/+$/, '');
  return `${base}/IP3-${bookingId}-${randomBytes(9).toString('base64url')}`;
}

const newBookingId = () => `BK-${Math.floor(100000 + Math.random() * 900000)}`;
const LIVE = ['pending', 'confirmed'];

/** Public: slots already held on a date (pending or confirmed), so the scheduler can grey them out. */
router.get(
  '/availability',
  asyncHandler(async (req, res) => {
    const date = String(req.query.date || '');
    if (!DATE_RE.test(date)) return res.json({ taken: [] });

    if (!isDBConnected()) {
      const taken = getInMemoryBookings()
        .filter((b) => b.date === date && b.holdsSlot !== false)
        .map((b) => b.timeSlot);
      return res.json({ taken });
    }

    const rows = await Booking.find({ date, status: { $in: LIVE } })
      .select('timeSlot')
      .lean();

    res.json({ taken: rows.map((r) => r.timeSlot) });
  })
);

/** Public: request a consultation slot. The booking waits for an admin to confirm it. */
router.post(
  '/',
  bookLimiter,
  asyncHandler(async (req, res) => {
    const payload = sanitizePayload(req.body);
    const name = payload.name || payload.clientName;
    const email = payload.email || payload.clientEmail;

    if (!name || String(name).length < 2) throw httpError(400, 'Please provide your name.', 'INVALID_NAME');
    if (!isEmail(email)) throw httpError(400, 'Please provide a valid email address.', 'INVALID_EMAIL');
    if (!DATE_RE.test(payload.date || '')) throw httpError(400, 'Please choose a valid date.', 'INVALID_DATE');
    if (!payload.timeSlot) throw httpError(400, 'Please choose a time slot.', 'INVALID_SLOT');

    const today = new Date().toISOString().split('T')[0];
    if (payload.date < today) throw httpError(400, 'That date is in the past.', 'PAST_DATE');

    const bookingId = newBookingId();
    // A visitor can never set these: they belong to the admin's confirmation step.
    const { status: _s, holdsSlot: _h, meetLink: _m, confirmedAt: _c, expiresAt: _e, ...fields } = payload;
    const record = {
      ...fields,
      name,
      email,
      bookingId,
      ticketId: `IP3-${bookingId}`,
      source: payload.source || 'Consultation Scheduler',
      status: 'pending',
      holdsSlot: true,
      meetLink: '',
    };

    let booking;
    try {
      booking = isDBConnected()
        ? await Booking.create({ ...record, expiresAt: expiryFor(payload.date) })
        : addInMemoryBooking({ ...record, expiresAt: expiryFor(payload.date).toISOString() });
    } catch (err) {
      // 11000 = the unique slot index (or the in-memory check) rejected a double booking.
      if (err?.code === 11000) {
        throw httpError(409, 'That slot has just been taken. Please pick another time.', 'SLOT_TAKEN');
      }
      throw err;
    }

    res.status(201).json({
      ok: true,
      status: 'pending',
      bookingId: booking.bookingId,
      ticketId: booking.ticketId,
      timestamp: booking.createdAt,
      startsAt: `${booking.date} ${booking.timeSlot}`,
      endsAt: `${booking.date} (${MEETING_MINUTES} mins)`,
    });
  })
);

/** Admin: schedule. Expired bookings are swept first. */
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, limit = 200 } = req.query;
    const filter = {};
    if (status) filter.status = String(status);
    const max = Math.min(Number(limit) || 200, 500);

    if (!isDBConnected()) {
      return res.json({ items: getInMemoryBookings(filter).slice(0, max) });
    }

    await purgeExpired(Booking);
    const items = await Booking.find(filter).sort({ date: 1, createdAt: -1 }).limit(max).lean();
    res.json({ items });
  })
);

/** Applies a status change to one booking, in MongoDB or the in-memory store. */
async function updateBooking(id, changes) {
  if (!isDBConnected()) {
    const item = updateInMemoryBooking(id, changes);
    if (!item) throw httpError(404, 'Booking not found.', 'NOT_FOUND');
    return item;
  }
  if (!isValidId(id)) throw httpError(400, 'Invalid booking id.', 'INVALID_ID');
  const item = await Booking.findByIdAndUpdate(id, { $set: changes }, { new: true }).lean();
  if (!item) throw httpError(404, 'Booking not found.', 'NOT_FOUND');
  return item;
}

async function findBooking(id) {
  if (!isDBConnected()) return getInMemoryBookings().find((b) => b._id === id) || null;
  if (!isValidId(id)) throw httpError(400, 'Invalid booking id.', 'INVALID_ID');
  return Booking.findById(id).lean();
}

/** Admin: confirm a pending booking. Generates the meeting link (kept if one was already made). */
router.patch(
  '/:id/confirm',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const current = await findBooking(req.params.id);
    if (!current) throw httpError(404, 'Booking not found.', 'NOT_FOUND');
    if (current.status === 'cancelled' || current.status === 'declined') {
      throw httpError(409, 'This booking was cancelled or declined and its slot may have been taken. Ask the client to book again.', 'NOT_LIVE');
    }
    const item = await updateBooking(req.params.id, {
      status: 'confirmed',
      holdsSlot: true,
      meetLink: current.meetLink || meetingLinkFor(current.bookingId),
      confirmedAt: new Date().toISOString(),
    });
    res.json({ ok: true, item });
  })
);

/** Admin: decline a request. Frees the slot. */
router.patch(
  '/:id/decline',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await updateBooking(req.params.id, { status: 'declined', holdsSlot: false });
    res.json({ ok: true, item });
  })
);

/** Admin: cancel a booking (pending or confirmed). Frees the slot. */
router.patch(
  '/:id/cancel',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await updateBooking(req.params.id, { status: 'cancelled', holdsSlot: false });
    res.json({ ok: true, item });
  })
);

export default router;
