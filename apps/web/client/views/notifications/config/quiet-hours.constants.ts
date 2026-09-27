export const QUIET_HOURS = {
  defaults: { start: 23, end: 8 },
  dial: { size: 200, center: 100, arcRadius: 78, tickOuter: 94, tickInner: 88, majorTickInner: 84, labelRadius: 64, needleInset: 14 },
  hoursInDay: 24,
  majorEvery: 6,
  nowTickMs: 60_000,
  fields: ['start', 'end']
} as const;
