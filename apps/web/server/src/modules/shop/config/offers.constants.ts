export const OFFER_SCRAPE = {
  source: 'tanki.su',
  maxDetailPages: 8,
  tankKeyword: /танк|техник/i
} as const;

export const OFFER_RETURN = {
  minOccurrences: 2,
  minAbsentDays: 14,
  archiveLimit: 100
} as const;
