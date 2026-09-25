export const RATING_PALETTES = ['default', 'xvm'] as const;

export type RatingPalette = (typeof RATING_PALETTES)[number];

const KNOWN: readonly unknown[] = RATING_PALETTES;

export const isRatingPalette = (value: unknown): value is RatingPalette => KNOWN.includes(value);
