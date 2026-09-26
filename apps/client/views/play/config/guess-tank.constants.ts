import { hoursToMilliseconds } from 'date-fns';

export const GUESS_TANK = {
  maxGuesses: 6,
  minTier: 5,
  storageKey: 'bronevik-guess-tank',
  streakKey: 'bronevik-guess-tank:streak',
  epoch: '2026-01-01',
  timeZone: 'Europe/Moscow',
  utcOffset: '+03:00',
  detailStaleMs: hoursToMilliseconds(1)
} as const;

export const GUESS_TOLERANCE = {
  damageMatch: 0.05,
  damageClose: 0.15,
  winRateMatch: 0.5,
  winRateClose: 1.5,
  tierClose: 1
} as const;

export const GUESS_CELLS = ['tier', 'type', 'nation', 'premium', 'damage', 'winRate'] as const;

export const GUESS_CLUES = ['tier', 'nation', 'shell', 'health', 'letter'] as const;

export const GUESS_LEGEND = ['match', 'close', 'miss'] as const;

export const GUESS_SHARE_MARKS = {
  match: '+',
  close: '~',
  miss: 'x',
  unknown: '.'
} as const;

export const GUESS_VIEW = {
  noValue: '—',
  maxBlur: 14,
  skeletonRows: 4
} as const;
