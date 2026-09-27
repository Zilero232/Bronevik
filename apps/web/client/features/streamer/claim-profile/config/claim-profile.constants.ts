export const CLAIM_PROFILE = {
  iconSize: 15,
  conflictStatus: 409,
  evidenceMin: 10,
  evidenceMax: 1000,
  evidenceRows: 5,
  twitchProvider: 'twitch',
  skeletonHeight: 220
} as const;

export const MANUAL_CLAIM_DEFAULT_VALUES = { evidence: '' } as const;
