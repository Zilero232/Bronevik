export const TEAM_HP = {
  styles: ['full', 'segments', 'icons', 'compact', 'minimal', 'numbers', 'bars'],
  barWidth: { full: 160, bars: 190, segments: 190, icons: 160, minimal: 110 },
  barHeight: { labelled: 16, plain: 8, thin: 3 },
  labelledStyles: ['full', 'icons'],
  outsideNumberStyles: ['compact', 'numbers'],
  iconSize: 16,
  iconBar: { width: 16, height: 3 },
  segmentGap: 1,
  tierGap: 4,
  numberWidth: 52,
  deadAlpha: 0.35
} as const;
