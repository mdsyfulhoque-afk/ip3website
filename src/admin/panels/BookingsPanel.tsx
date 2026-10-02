import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  Video,
  MapPin,
  Mail,
  Phone,
  Trash2,
  ExternalLink,
  Check,
  X,
  Send,
} from 'lucide-react';
import { listBookings, cancelBooking, confirmBooking, declineBooking } from '../../lib/contentStore';

interface Booking {
  _id: string;
  bookingId: string;
  /** The API stores `name` and `email`; the older field names are read as a fallback. */
  name?: string;
  email?: string;
  clientName?: string;
  clientEmail?: string;
  phone?: string;
  organization?: string;
  companyName?: string;
  topic?: string;
  serviceTitle?: string;
  date: string;
  timeSlot: string;
  meetingMode: 'virtual' | 'in_person';
  notes?: string;
  meetLink?: string;
  meetProvider?: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
  confirmed: 'bg-[#e3a94b]/12 text-[#e3a94b] border-[#e3a94b]/30',
};

const STATUS_LABEL: Record<string, string> = { pending: 'awaiting confirmation' };

/** A ready-to-send email to the client, opened in the admin's own mail program. */
function mailto(b: Booking, kind: 'confirm' | 'decline'): string {
  const name = b.name || b.clientName || '';
  const to = b.email || b.clientEmail || '';
  const subject =
    kind === 'confirm' ? `Your IP3 consultation is confirmed (${b.bookingId})` : `Your IP3 consultation request (${b.bookingId})`;
  const body =
    kind === 'confirm'
      ? `Dear ${name},\n\nThank you for booking a conversation with IP3 Consulting Limited. Your consultation is confirmed:\n\nDate: ${b.date}\nTime: ${b.timeSlot} (Dhaka time, GMT+6)\nJoin online: ${b.meetLink || ''}\nReference: ${b.bookingId}\n\nIf you need to change the time, reply to this email and quote the reference.\n\nKind regards,\nIP3 Consulting Limited`
      : `Dear ${name},\n\nThank you for your request to meet IP3 Consulting Limited on ${b.date} at ${b.timeSlot} (Dhaka time). Unfortunately we cannot meet at that time. Please reply with two or three times that would suit you, or book another slot on our website.\n\nReference: ${b.bookingId}\n\nKind regards,\nIP3 Consulting Limited`;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const BookingsPanel: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listBookings();
      setBookings(items as unknown as Booking[]);
      setTotal(items.length);
    } catch (err: any) {
      setError(err?.message || 'Could not load bookings from the database.');
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cancel = async (booking: Booking) => {
    if (!window.confirm(`Cancel ${booking.bookingId}?`)) return;
    setCancelling(booking.bookingId);
    try {
      await cancelBooking(booking._id);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === booking.bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err: any) {
      setError(err?.message || 'Could not cancel that booking.');
    } finally {
      setCancelling(null);
    }
  };

  const confirm = async (booking: Booking) => {
    setWorking(booking.bookingId);
    setError(null);
    try {
      const item = (await confirmBooking(booking._id)) as unknown as Booking;
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? { ...b, ...item } : b)));
    } catch (err: any) {
      setError(err?.message || 'Could not confirm that booking.');
    } finally {
      setWorking(null);
    }
  };

  const decline = async (booking: Booking) => {
    if (!window.confirm(`Decline ${booking.bookingId}? The slot becomes free again.`)) return;
    setWorking(booking.bookingId);
    setError(null);
    try {
      await declineBooking(booking._id);
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? { ...b, status: 'declined' } : b)));
    } catch (err: any) {
      setError(err?.message || 'Could not decline that booking.');
    } finally {
      setWorking(null);
    }
  };

  const pending = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-100 flex items-center gap-2.5">
            <CalendarCheck className="w-5 h-5 text-[#e3a94b]" />
            Consultations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {total} booking{total === 1 ? '' : 's'}
            {pending ? `, ${pending} awaiting confirmation` : ''}. Times are Dhaka time. Confirming creates the meeting link;
            bookings are deleted 60 days after the meeting.
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#e3a94b]/10 border border-[#e3a94b]/40 text-[#e3a94b] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && bookings.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#e3a94b]" />
          <span className="text-xs">Loading consultations…</span>
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="py-16 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
          No consultations booked yet.
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {bookings.map((b) => (
          <div
            key={b._id}
            className={`bg-[#081220] border rounded-2xl p-4 transition-colors ${
              b.status === 'cancelled' || b.status === 'declined'
                ? 'border-slate-800 opacity-55'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <span className="font-mono text-xs font-bold text-[#e3a94b]">{b.bookingId}</span>
                <p className="text-sm font-semibold text-slate-100 mt-1 truncate">
                  {b.name || b.clientName || 'Unnamed contact'}
                  {b.organization || b.companyName ? (
                    <span className="font-normal text-slate-400"> · {b.organization || b.companyName}</span>
                  ) : null}
                </p>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                  STATUS_STYLE[b.status] || 'bg-slate-800/50 text-slate-400 border-slate-800'
                }`}
              >
                {STATUS_LABEL[b.status] || b.status}
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between gap-3">
                <span>Date &amp; time</span>
                <span className="font-semibold text-slate-100">
                  {b.date} @ {b.timeSlot}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Practice focus</span>
                <span className="font-semibold text-slate-100 truncate">{b.serviceTitle || b.topic || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Mode</span>
                <span className="font-semibold text-[#e3a94b] flex items-center gap-1">
                  {b.meetingMode === 'virtual' ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                  {b.meetingMode === 'virtual' ? 'Virtual' : 'In-person'}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1 text-slate-500">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  {b.email || b.clientEmail}
                </span>
                {b.phone ? (
                  <span className="flex items-center gap-1 shrink-0">
                    <Phone className="w-3 h-3" />
                    {b.phone}
                  </span>
                ) : null}
              </div>
            </div>

            {b.notes && (
              <p className="mt-3 text-[11px] text-slate-400 leading-relaxed bg-[#050a12] p-3 rounded-xl border border-slate-800">
                {b.notes}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              {b.status === 'pending' && (
                <>
                  <button
                    onClick={() => confirm(b)}
                    disabled={working === b.bookingId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e3a94b] hover:bg-[#c98a1e] text-slate-900 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {working === b.bookingId ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Confirm and create meeting link
                  </button>
                  <button
                    onClick={() => decline(b)}
                    disabled={working === b.bookingId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050a12] hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                    Decline
                  </button>
                  <a
                    href={mailto(b, 'decline')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-100 text-[11px] font-bold transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    Suggest another time
                  </a>
                </>
              )}

              {b.status === 'confirmed' && b.meetLink && (
                <>
                  <a
                    href={mailto(b, 'confirm')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e3a94b] hover:bg-[#c98a1e] text-slate-900 text-[11px] font-bold transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Email the client
                  </a>
                  <a
                    href={b.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050a12] hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open meeting
                  </a>
                </>
              )}

              {b.status === 'confirmed' && (
                <button
                  onClick={() => cancel(b)}
                  disabled={cancelling === b.bookingId}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050a12] hover:bg-slate-800 text-slate-400 hover:text-[#e3a94b] text-[11px] font-bold border border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cancelling === b.bookingId ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Cancel
                </button>
              )}
            </div>
            {b.status === 'confirmed' && b.meetLink && (
              <p className="mt-2 text-[11px] text-slate-500 break-all">Meeting link: {b.meetLink}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPanel;
