export const BONUS_CODE = {
  pattern: /^(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]{6,24}$/,
  titlePattern: /бонус-коды?\s+([A-Z0-9, ]{6,80})/giu,
  titleTokenPattern: /^(?=[A-Z0-9]*[A-Z])[A-Z0-9]{6,24}$/,
  minReports: 3,
  verdictShare: 0.6,
  reportWindowDays: 3,
  staleAfterDays: 60,
  wotexpressSource: 'wotexpress.info',
  reportThrottle: { limit: 20, ttl: 60_000 }
} as const;
