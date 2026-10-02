import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTENT, isTbc, mergeContent } from './index';
import { validateContent } from './validate';
import { prerenderPaths } from '../site/routes';

describe('bundled content', () => {
  it('passes its own validation', () => {
    expect(validateContent(DEFAULT_CONTENT)).toEqual([]);
  });

  it('has the structure the pages rely on', () => {
    expect(DEFAULT_CONTENT.sectors).toHaveLength(8);
    expect(DEFAULT_CONTENT.services).toHaveLength(5);
    expect(DEFAULT_CONTENT.domains).toHaveLength(3);
    expect(DEFAULT_CONTENT.capabilities).toHaveLength(6);
    expect(DEFAULT_CONTENT.method.movements).toHaveLength(6);
    expect(DEFAULT_CONTENT.home.hero.headline).toBe('From polycrisis to polysolution.');
  });

  it('contains no leftovers from the old agriculture template or invented proof', () => {
    const text = JSON.stringify(DEFAULT_CONTENT).toLowerCase();
    // Real profiles mention agricultural economics and family farms, so the old template is caught by its own phrases.
    for (const banned of ['precision agronomy', 'agritech', 'farm address', 'corvallis', 'sterling', 'rostova', 'samurai', 'unsplash', 'testimonial', '$140m']) {
      expect(text, banned).not.toContain(banned);
    }
  });

  it('uses unique slugs and every prerendered path is unique', () => {
    const paths = prerenderPaths(DEFAULT_CONTENT);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('mergeContent', () => {
  it('returns the defaults for an empty, missing or old-shaped database', () => {
    expect(mergeContent(null)).toBe(DEFAULT_CONTENT);
    expect(mergeContent({})).toBe(DEFAULT_CONTENT);
    expect(mergeContent({ slides: [{ title: 'Precision Agronomy' }], theme: {} })).toBe(DEFAULT_CONTENT);
  });

  it('lays published copy over the defaults and keeps fields it does not mention', () => {
    const merged = mergeContent({ content: { contact: { email: 'hello@example.org' } } });
    expect(merged.contact.email).toBe('hello@example.org');
    expect(merged.contact.hours).toBe(DEFAULT_CONTENT.contact.hours);
    expect(merged.sectors).toBe(DEFAULT_CONTENT.sectors);
  });

  it('replaces arrays whole so an editor can remove an item', () => {
    const one = DEFAULT_CONTENT.sectors.slice(0, 1);
    expect(mergeContent({ content: { sectors: one } }).sectors).toHaveLength(1);
  });

  it('ignores values of the wrong type instead of breaking the page', () => {
    const merged = mergeContent({ content: { contact: { email: 42, address: 'not a list' }, home: 'nope' } });
    expect(merged.contact.email).toBe(DEFAULT_CONTENT.contact.email);
    expect(merged.contact.address).toEqual(DEFAULT_CONTENT.contact.address);
    expect(merged.home).toEqual(DEFAULT_CONTENT.home);
  });
});

describe('validateContent', () => {
  it('flags a repeated slug, an unknown cross-reference and an empty required field', () => {
    const broken = structuredClone(DEFAULT_CONTENT);
    broken.sectors[1]!.slug = broken.sectors[0]!.slug;
    broken.sectors[2]!.services = ['no-such-service'];
    broken.identity.name = '';
    const problems = validateContent(broken).join('\n').toLowerCase();
    expect(problems).toContain('used twice');
    expect(problems).toContain('no-such-service');
    expect(problems).toContain('name');
  });
});

describe('isTbc', () => {
  it('recognises the placeholder phrases and nothing else', () => {
    expect(isTbc('Client to be confirmed')).toBe(true);
    expect(isTbc('')).toBe(true);
    expect(isTbc(undefined)).toBe(true);
    expect(isTbc('Bangladesh Bank')).toBe(false);
  });
});
