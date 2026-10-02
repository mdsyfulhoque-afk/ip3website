import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    ticketId: { type: String, required: true },
    source: { type: String, default: 'Consultation Scheduler' },
    /** pending (requested) → confirmed by an admin, or declined / cancelled. */
    status: { type: String, default: 'pending', index: true },
    /** True while the booking keeps its slot (pending or confirmed). */
    holdsSlot: { type: Boolean, default: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    organization: String,
    serviceId: String,
    serviceTitle: String,
    meetingMode: { type: String, default: 'virtual' },
    date: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    meetLink: String,
    confirmedAt: Date,
    notes: String,
    /** Deleted by MongoDB at this moment (see server/lib/retention.js). */
    expiresAt: Date,
  },
  { timestamps: true, strict: false, minimize: false }
);

/** One live booking (pending or confirmed) per slot — enforced by the database, not the browser. */
BookingSchema.index({ date: 1, timeSlot: 1 }, { unique: true, partialFilterExpression: { holdsSlot: true }, name: 'slot_hold' });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'retention_ttl' });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;
