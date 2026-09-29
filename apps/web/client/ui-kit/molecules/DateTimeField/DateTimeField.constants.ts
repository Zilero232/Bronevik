export const DATE_TIME_FIELD_VIEW = {
  stepMinutes: 15,
  iconSize: 15,
  stepIconSize: 12,
  emptyTime: '--',
  twoDigits: { minimumIntegerDigits: 2, useGrouping: false },
  hours: { min: 0, max: 23 },
  minutes: { min: 0, max: 59 }
} as const;
