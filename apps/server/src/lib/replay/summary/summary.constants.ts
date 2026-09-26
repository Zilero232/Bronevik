export const GAME_TITLE = {
  lesta: /мир\s*танков|mir\s*tankov|lesta/i,
  wg: /world\s*of\s*tanks|坦克世界/i
} as const;

export const REPLAY_PATTERN = {
  clientVersion: /(\d+)\.(\d+)(?:\.(\d+))?(?:\.(\d+))?/,
  dateTime: /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/
} as const;

export const VEHICLE_RESULT = {
  aliveDeathReason: -1
} as const;
