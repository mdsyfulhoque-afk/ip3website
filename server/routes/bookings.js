import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Booking from '../models/Booking.js';
import { requireAdmin } from '../lib/auth.js';
import { asyncHandler, httpError, isValidId, sanitizePayload, isEmail } from '../lib/helpers.js';
import { isDBConnected } from '../lib/db.js';
import {
  addInMemoryBooking,
  getInMemoryBookings,
  cancelInMemoryBooking,
} from '../lib/inMemoryStore.js';

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
// Only a real link is ever returned. If MEETING_LINK is not set, the team sends joining details by email.
const MEET_LINK = process.env.MEETING_LINK || '';

const newBookingId = () => `BK-${Math.floor(100000 + Math.random() * 900000)}`;

/** Public: slots already taken on a date, so the scheduler can grey them out. */
router.get(
  '/availability',
  asyncHandler(async (req, res) => {
    const date = String(req.query.date || '');
    if (!DATE_RE.test(date)) return res.json({ taken: [] });

    if (!isDBConnected()) {
      const taken = getInMemoryBookings()
        .filter((b) => b.date === date && b.status !== 'cancelled')
        .map((b) => b.timeSlot);
      return res.json({ taken });
    }

    const rows = await Booking.find({ date, status: { $ne: 'cancelled' } })
      .select('timeSlot')
      .lean();

    res.json({ taken: rows.map((r) => r.timeSlot) });
  })
);

/** Public: confirm a consultation slot. */
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

    if (!isDBConnected()) {
      try {
        const booking = addInMemoryBooking({
          ...payload,
          name,
          email,
          bookingId,
          ticketId: `IP3-${bookingId}`,
          source: payload.source || 'Consultation Scheduler',
          meetLink: MEET_LINK,
        });
        return res.status(201).json({
          ok: true,
          bookingId: booking.bookingId,
          ticketId: booking.ticketId,
          meetLink: booking.meetLink,
          timestamp: booking.createdAt,
          startsAt: `${booking.date} ${booking.timeSlot}`,
          endsAt: `${booking.date} (${MEETING_MINUTES} mins)`,
        });
      } catch (err) {
        if (err?.code === 11000) {
          throw httpError(409, 'That slot has just been taken. Please pick another time.', 'SLOT_TAKEN');
        }
        throw err;
      }
    }

    let booking;
    try {
      booking = await Booking.create({
        ...payload,
        name,
        email,
        bookingId,
        ticketId: `IP3-${bookingId}`,
        source: payload.source || 'Consultation Scheduler',
        status: 'confirmed',
        meetLink: MEET_LINK,
      });
    } catch (err) {
      // 11000 = the unique {date, timeSlot} index rejected a double booking.
      if (err?.code === 11000) {
        throw httpError(409, 'That slot has just been taken. Please pick another time.', 'SLOT_TAKEN');
      }
      throw err;
    }

    res.status(201).json({
      ok: true,
      bookingId: booking.bookingId,
      ticketId: booking.ticketId,
      meetLink: booking.meetLink,
      timestamp: booking.createdAt,
      startsAt: `${booking.date} ${booking.timeSlot}`,
      endsAt: `${booking.date} (${MEETING_MINUTES} mins)`,
    });
  })
);

/** Admin: schedule. */
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, limit = 200 } = req.query;
    const filter = {};
    if (status) filter.status = String(status);

    if (!isDBConnected()) {
      return res.json({ items: getInMemoryBookings(filter).slice(0, Math.min(Number(limit) || 200, 500)) });
    }

    const items = await Booking.find(filter)
      .sort({ date: 1, createdAt: -1 })
      .limit(Math.min(Number(limit) || 200, 500))
      .lean();

    res.json({ items });
  })
);

router.patch(
  '/:id/cancel',
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!isDBConnected()) {
      const item = cancelInMemoryBooking(req.params.id);
      if (!item) throw httpError(404, 'Booking not found.', 'NOT_FOUND');
      return res.json({ ok: true, item });
    }

    if (!isValidId(req.params.id)) throw httpError(400, 'Invalid booking id.', 'INVALID_ID');

    const item = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'cancelled' } },
      { new: true }
    ).lean();

    if (!item) throw httpError(404, 'Booking not found.', 'NOT_FOUND');
    res.json({ ok: true, item });
  })
);

export default router;
