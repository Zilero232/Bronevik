export const TANK_IMAGE = {
  large: { width: 600, height: 450, glyph: 48, sources: ['large', 'big'], isOptimized: true, sizes: '(max-width: 400px) 100vw, 400px' },
  big: { width: 160, height: 100, glyph: 40, sources: ['big'], isOptimized: true, sizes: undefined },
  small: { width: 124, height: 31, glyph: 16, sources: ['small'], isOptimized: false, sizes: undefined },
  contour: { width: 60, height: 24, glyph: 14, sources: ['contour'], isOptimized: false, sizes: undefined }
} as const;
