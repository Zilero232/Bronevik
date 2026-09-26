import { OVERLAY_THEMES, overlayConfigSchema } from '@otmetki/schemas';

const { layout, resetAt, locale } = overlayConfigSchema.shape;

export const OVERLAY_OPTIONS = {
  themes: OVERLAY_THEMES.standard,
  premiumThemes: OVERLAY_THEMES.premium,
  layouts: layout.unwrap().options,
  resets: resetAt.unwrap().options,
  locales: locale.unwrap().options
} as const;

export const OVERLAY_PREVIEW = {
  param: 'preview'
} as const;

export const OVERLAY_BOARD = {
  flashSeconds: 1.1,
  countSeconds: 0.9,
  ringSize: 64,
  ringThickness: 6,
  percentMax: 100
} as const;
