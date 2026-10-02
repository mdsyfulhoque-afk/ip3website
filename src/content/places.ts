/**
 * The map gazetteer: every key a portfolio entry may list in `places`.
 *
 * Structure is code: adding a place here (and re-running `npm run map`) puts it on the Impact Map.
 * Only places named in the team's CVs are listed. Work that covered the whole country is "BD".
 */

export type PlaceKind = 'nation' | 'site' | 'country';

export interface Place {
  kind: PlaceKind;
  label: string;
  /** Bangla label for the Bangla pages. */
  bn: string;
  /** Sites: longitude and latitude, or the upazila whose centre marks the site. */
  lon?: number;
  lat?: number;
  upazila?: string;
  /** Countries: ISO 3166-1 numeric id as used by world-atlas. */
  isoNumeric?: string;
}

export const PLACES: Record<string, Place> = {
  BD: { kind: 'nation', label: 'Bangladesh, nationwide', bn: 'বাংলাদেশ, দেশব্যাপী', isoNumeric: '050' },
  'BD-dhaka': { kind: 'site', label: 'Greater Dhaka', bn: 'বৃহত্তর ঢাকা', lon: 90.4125, lat: 23.8103 },
  'BD-payra': { kind: 'site', label: 'Payra Port, Patuakhali', bn: 'পায়রা বন্দর, পটুয়াখালী', upazila: 'Kalapara' },
  IND: { kind: 'country', label: 'India', bn: 'ভারত', isoNumeric: '356' },
  NPL: { kind: 'country', label: 'Nepal', bn: 'নেপাল', isoNumeric: '524' },
  VNM: { kind: 'country', label: 'Vietnam', bn: 'ভিয়েতনাম', isoNumeric: '704' },
  KHM: { kind: 'country', label: 'Cambodia', bn: 'কম্বোডিয়া', isoNumeric: '116' },
  KAZ: { kind: 'country', label: 'Kazakhstan', bn: 'কাজাখস্তান', isoNumeric: '398' },
  KGZ: { kind: 'country', label: 'Kyrgyz Republic', bn: 'কিরগিজ প্রজাতন্ত্র', isoNumeric: '417' },
  LAO: { kind: 'country', label: 'Lao PDR', bn: 'লাওস', isoNumeric: '418' },
  MDV: { kind: 'country', label: 'Maldives', bn: 'মালদ্বীপ', isoNumeric: '462' },
  MNG: { kind: 'country', label: 'Mongolia', bn: 'মঙ্গোলিয়া', isoNumeric: '496' },
  TJK: { kind: 'country', label: 'Tajikistan', bn: 'তাজিকিস্তান', isoNumeric: '762' },
  UZB: { kind: 'country', label: 'Uzbekistan', bn: 'উজবেকিস্তান', isoNumeric: '860' },
};
