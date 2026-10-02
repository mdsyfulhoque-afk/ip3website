import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTENT, phoneNumbers } from '../../content';
import { PLACES } from '../../content/places';
import { initialsOf } from '../team/initials';
import mapData from '../impact/map-data.json';
import { impactFigures, publishedWork, workAt, yearSpan } from './data';
import { expiryFor, isExpired, RETENTION_DAYS } from '../../../server/lib/retention.js';

describe('portfolio and impact figures', () => {
  const work = publishedWork(DEFAULT_CONTENT.portfolio);

  it('publishes only 2018-onward work, featured first', () => {
    expect(work.length).toBeGreaterThanOrEqual(20);
    expect(work.every((e) => e.status === 'published' && e.start >= 2018)).toBe(true);
    const firstPlain = work.findIndex((e) => !e.featured);
    expect(work.slice(firstPlain).some((e) => e.featured)).toBe(false);
  });

  it('counts figures from the entries themselves', () => {
    const f = impactFigures(work);
    expect(f.projects).toBe(work.length);
    expect(f.since).toBe(2018);
    // Bangladesh plus every country listed on a published entry, nothing more.
    const countries = new Set(work.flatMap((e) => e.places.map((k) => (PLACES[k]?.kind === 'country' ? k : 'BD'))));
    expect(f.countries).toBe(countries.size);
  });

  it('formats spans and finds work by place', () => {
    expect(yearSpan({ ...work[0]!, start: 2025, end: 0 })).toBe('2025–present');
    expect(yearSpan({ ...work[0]!, start: 2020, end: 2020 })).toBe('2020');
    expect(workAt(work, 'BD-payra').map((e) => e.id)).toEqual(['payra-seaport-advisory']);
  });

  it('has map geometry for every site and country in the gazetteer', () => {
    for (const [key, place] of Object.entries(PLACES)) {
      if (place.kind === 'site') expect(mapData.bd.sites, key).toHaveProperty(key);
      else expect(mapData.region.countries.map((c) => c.key), key).toContain(key);
    }
    expect(mapData.bd.labels).toHaveLength(8);
  });
});

describe('small helpers', () => {
  it('splits the phone field into callable numbers', () => {
    expect(phoneNumbers('+880 1974 011329, +880 1914 011329')).toEqual([
      { display: '+880 1974 011329', tel: '+8801974011329' },
      { display: '+880 1914 011329', tel: '+8801914011329' },
    ]);
    expect(phoneNumbers('to be confirmed')).toEqual([]);
  });

  it('draws initials from first and last names without honorifics', () => {
    expect(initialsOf('Prof. Dr. M Niaz Asadullah')).toBe('MA');
    expect(initialsOf('Dr. Md. Esraz-Ul-Zannat')).toBe('EZ');
    expect(initialsOf('Asst. Prof. Sazia Ahmed')).toBe('SA');
  });
});

describe('retention', () => {
  it('keeps records 60 days, bookings from the meeting date', () => {
    expect(RETENTION_DAYS).toBe(60);
    const day = 864e5;
    const enquiry = expiryFor().getTime() - Date.now();
    expect(Math.round(enquiry / day)).toBe(60);
    const meeting = new Date(Date.now() + 30 * day).toISOString().slice(0, 10);
    expect(Math.round((expiryFor(meeting).getTime() - Date.now()) / day)).toBeGreaterThanOrEqual(90);
    expect(isExpired({ createdAt: new Date(Date.now() - 61 * day).toISOString() })).toBe(true);
    expect(isExpired({ createdAt: new Date().toISOString(), expiresAt: expiryFor().toISOString() })).toBe(false);
  });
});
