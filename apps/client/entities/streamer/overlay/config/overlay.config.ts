import { overlayConfigSchema } from '@bronevik/schemas';

const { theme, layout, resetAt, locale } = overlayConfigSchema.shape;

export const OVERLAY_OPTIONS = {
  themes: theme.unwrap().options,
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
