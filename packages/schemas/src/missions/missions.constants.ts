export const MISSION_METRICS = ['damage', 'frags', 'spotting', 'blocked', 'survival', 'xp', 'accuracy', 'winRate'] as const;

export const MISSION_BRANCH_KINDS = ['vehicleClass', 'alliance', 'levelGroup'] as const;

export const MISSION_PROGRESS_SOURCES = ['manual', 'mod'] as const;

export const MISSION_GARAGE_STATES = ['ready', 'noLink', 'noPrivateData'] as const;

export const MISSION_TANKS_QUERY = {
  defaultPeriod: '30d',
  defaultLimit: 20,
  maxLimit: 100
} as const;
