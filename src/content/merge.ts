import { DEFAULT_CONTENT } from './defaults';
import type { SiteContent } from './types';

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Lays published content over the bundled defaults.
 *  - objects are merged key by key, so a field added to the defaults later still appears;
 *  - arrays and strings are replaced as a whole, so an editor can remove an item;
 *  - a value of the wrong type is ignored, so a bad edit cannot break the page.
 */
function overlay<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (isObject(base)) {
    if (!isObject(over)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(over)) {
      out[key] = key in out ? overlay(out[key], over[key]) : over[key];
    }
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

/** Accepts the raw tree from the API (`{ content: … }`) and returns a complete, safe `SiteContent`. */
export function mergeContent(raw: unknown, base: SiteContent = DEFAULT_CONTENT): SiteContent {
  if (!isObject(raw) || !isObject(raw.content)) return base;
  return overlay(base, raw.content) as SiteContent;
}

/** True for the placeholder phrases used in defaults for facts the owner still has to supply. */
export function isTbc(value: string | undefined | null): boolean {
  if (!value) return true;
  return /to be confirmed|^tbc$|^n\/a$/i.test(value.trim());
}
