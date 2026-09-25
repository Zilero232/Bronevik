export const PLAYER_TANKS = {
  maxLimit: 1000
} as const;

export const PLAYER_ACTIVITY = {
  minDays: 7,
  maxDays: 730,
  defaultDays: 365
} as const;

export const POPULAR_PLAYERS = {
  defaultDays: 7,
  maxDays: 30,
  defaultLimit: 20,
  maxLimit: 100
} as const;
