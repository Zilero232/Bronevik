export const MARKS_PANEL = {
  markSize: 24,
  fallbackMark: 'otmetki:target',
  battlesGlyph: 'otmetki:session',
  battlesSize: 12,
  checkGlyph: 'check',
  checkSize: 10,
  upGlyph: 'trend_up',
  upSize: 12,
  arrow: '›',
  sourceTones: { verified: 'success', estimated: 'warning' },
  deltaTones: { rising: 'good', falling: 'bad', flat: 'muted' },
  unknownPercent: '—'
} as const;
