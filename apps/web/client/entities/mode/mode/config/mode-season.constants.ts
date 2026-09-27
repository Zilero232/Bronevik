export const MODE_SEASON = {
  dateFormat: { day: 'numeric', month: 'short' }
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;
