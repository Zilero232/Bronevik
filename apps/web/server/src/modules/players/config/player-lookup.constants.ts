export const PLAYER_LOOKUP = {
  numericId: /^\d{1,12}$/,
  infoExtra: ['statistics.random'],
  infoFields: [
    'account_id',
    'nickname',
    'clan_id',
    'global_rating',
    'created_at',
    'last_battle_time',
    'logout_at',
    'updated_at',
    'statistics.all',
    'statistics.random'
  ],
  modeExtra: ['statistics.epic', 'statistics.ranked_battles'],
  missingKeyPrefix: 'otmetki:players:missing:',
  missingTtlSeconds: 600,
  missingMarker: '1',
  modeFields: [
    'account_id',
    'statistics.stronghold_skirmish',
    'statistics.stronghold_defense',
    'statistics.globalmap_absolute',
    'statistics.globalmap_middle',
    'statistics.globalmap_champion',
    'statistics.epic',
    'statistics.ranked_battles'
  ]
} as const;

export const PLAYER_VIEWS = {
  keyPrefix: 'otmetki:players:views:',
  retentionSeconds: 31 * 86_400,
  perDayCandidates: 500,
  overfetch: 2
} as const;

export const PLAYER_ACHIEVEMENTS = {
  fields: ['achievements', 'max_series']
} as const;
