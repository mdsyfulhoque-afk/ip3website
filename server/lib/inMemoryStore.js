import fs from 'fs';
import path from 'path';

/**
 * In-memory fallback store when MongoDB is not configured or offline.
 * Provides local file persistence of published content while developing without a database.
 */

const STORE_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(STORE_DIR, 'content_store.json');

export const inMemoryStore = {
  content: null,
  revisions: [],
  leads: [],
  bookings: [],
  media: [],
};

// Initialize content from disk if previously saved
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data) {
      inMemoryStore.content = parsed;
    }
  }
} catch (err) {
  console.warn('[store] Could not read content_store.json:', err.message);
}

let nextLeadId = 1;
let nextBookingId = 1;
let nextMediaId = 1;
let nextRevisionId = 1;

export function getInMemoryContent() {
  return inMemoryStore.content;
}

export function setInMemoryContent(data, updatedBy = 'admin', note = '') {
  const version = (inMemoryStore.content?.version || 0) + 1;
  const updatedAt = new Date().toISOString();
  
  inMemoryStore.content = {
    key: 'site',
    data,
    version,
    updatedBy,
    updatedAt,
  };

  const revision = {
    _id: `rev_${nextRevisionId++}`,
    version,
    note: note || `Published version ${version}`,
    createdBy: updatedBy,
    data,
    createdAt: updatedAt,
  };
  inMemoryStore.revisions.unshift(revision);
  if (inMemoryStore.revisions.length > 30) {
    inMemoryStore.revisions.pop();
  }

  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(inMemoryStore.content, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[store] Could not write to content_store.json:', err.message);
  }

  return inMemoryStore.content;
}

export function getInMemoryRevisions() {
  return inMemoryStore.revisions.map((r) => ({
    _id: r._id,
    version: r.version,
    note: r.note,
    createdBy: r.createdBy,
    createdAt: r.createdAt,
  }));
}

export function restoreInMemoryRevision(id, updatedBy = 'admin') {
  const target = inMemoryStore.revisions.find((r) => r._id === id);
  if (!target) return null;
  return setInMemoryContent(target.data, updatedBy, `Restored from revision v${target.version}`);
}

export function addInMemoryLead(leadData) {
  const lead = {
    _id: `lead_${nextLeadId++}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...leadData,
  };
  inMemoryStore.leads.unshift(lead);
  return lead;
}

export function getInMemoryLeads(filter = {}) {
  return inMemoryStore.leads.filter((item) => {
    if (filter.status && item.status !== filter.status) return false;
    if (filter.source && item.source !== filter.source) return false;
    return true;
  });
}

export function updateInMemoryLead(id, status) {
  const lead = inMemoryStore.leads.find((item) => item._id === id);
  if (!lead) return null;
  lead.status = status;
  return lead;
}

export function deleteInMemoryLead(id) {
  const index = inMemoryStore.leads.findIndex((item) => item._id === id);
  if (index === -1) return false;
  inMemoryStore.leads.splice(index, 1);
  return true;
}

export function addInMemoryBooking(bookingData) {
  const existing = inMemoryStore.bookings.find(
    (b) => b.date === bookingData.date && b.timeSlot === bookingData.timeSlot && b.status !== 'cancelled'
  );
  if (existing) {
    const err = new Error('Slot already taken');
    err.code = 11000;
    throw err;
  }

  const booking = {
    _id: `bk_${nextBookingId++}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    ...bookingData,
  };
  inMemoryStore.bookings.unshift(booking);
  return booking;
}

export function getInMemoryBookings(filter = {}) {
  return inMemoryStore.bookings.filter((item) => {
    if (filter.status && item.status !== filter.status) return false;
    return true;
  });
}

export function cancelInMemoryBooking(id) {
  const booking = inMemoryStore.bookings.find((item) => item._id === id);
  if (!booking) return null;
  booking.status = 'cancelled';
  return booking;
}

export function addInMemoryMedia(mediaData) {
  const existingIndex = inMemoryStore.media.findIndex((m) => m.publicId === mediaData.publicId);
  const media = {
    _id: `med_${nextMediaId++}`,
    createdAt: new Date().toISOString(),
    ...mediaData,
  };
  if (existingIndex >= 0) {
    inMemoryStore.media[existingIndex] = { ...inMemoryStore.media[existingIndex], ...media };
    return inMemoryStore.media[existingIndex];
  }
  inMemoryStore.media.unshift(media);
  return media;
}

export function getInMemoryMedia(filter = {}) {
  return inMemoryStore.media.filter((item) => {
    if (filter.resourceType && item.resourceType !== filter.resourceType) return false;
    return true;
  });
}

export function deleteInMemoryMedia(id) {
  const index = inMemoryStore.media.findIndex((m) => m._id === id);
  if (index === -1) return null;
  const deleted = inMemoryStore.media.splice(index, 1)[0];
  return deleted;
}
