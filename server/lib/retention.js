/**
 * Data retention. Enquiries and bookings are kept for RETENTION_DAYS (default 60) and then deleted:
 *  - MongoDB deletes them itself through a TTL index on `expiresAt`;
 *  - records written before `expiresAt` existed, and the in-memory store, are swept by `purgeExpired`
 *    whenever an admin opens the inbox or the schedule.
 * A booking is kept until RETENTION_DAYS after the later of the day it was made and the meeting itself.
 */
export const RETENTION_DAYS = Math.max(1, Number(process.env.RETENTION_DAYS || 60));
const DAY = 24 * 60 * 60 * 1000;

/** Expiry for a record created now, or for a meeting on `meetingDate` (YYYY-MM-DD) if that is later. */
export function expiryFor(meetingDate) {
  const now = Date.now();
  const meeting = meetingDate ? Date.parse(`${meetingDate}T23:59:59+06:00`) : NaN;
  const base = Number.isFinite(meeting) && meeting > now ? meeting : now;
  return new Date(base + RETENTION_DAYS * DAY);
}

/** The moment before which an undated record has outlived the retention period. */
export function retentionCutoff() {
  return new Date(Date.now() - RETENTION_DAYS * DAY);
}

/** True when an in-memory record should be gone. */
export function isExpired(record) {
  if (record.expiresAt) return Date.parse(record.expiresAt) <= Date.now();
  return Date.parse(record.createdAt) <= retentionCutoff().getTime();
}

/** Deletes expired documents from a Mongoose model, including old ones that never had `expiresAt`. */
export async function purgeExpired(Model) {
  const now = new Date();
  await Model.deleteMany({
    $or: [{ expiresAt: { $lte: now } }, { expiresAt: { $exists: false }, createdAt: { $lte: retentionCutoff() } }],
  });
}
