export const PLAYER_LOOKUP = {
  numericId: /^\d{1,12}$/,
  infoExtra: ['statistics.random']
} as const;

export const PLAYER_VIEWS = {
  keyPrefix: 'otmetki:players:views:',
  retentionSeconds: 31 * 86_400,
  perDayCandidates: 500,
  overfetch: 2
} as const;
