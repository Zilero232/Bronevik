export const TEAM_HP = {
  styles: ['full', 'segments', 'icons', 'compact', 'minimal', 'numbers', 'bars'],
  barWidth: { full: 190, bars: 220, segments: 220, icons: 190, minimal: 120 },
  barHeight: { regular: 10, thin: 4 },
  iconSize: 16,
  iconBar: { width: 16, height: 3 },
  segmentGap: 1,
  numberWidth: 52,
  deadAlpha: 0.35
} as const;
