export const TANK_IMAGE = {
  big: { width: 160, height: 100, glyph: 44 },
  small: { width: 124, height: 31, glyph: 18 },
  contour: { width: 60, height: 24, glyph: 16 }
} as const;

export type TankImageSize = keyof typeof TANK_IMAGE;
