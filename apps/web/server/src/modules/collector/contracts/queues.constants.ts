export const QUEUE = {
  enrol: 'collector.enrol',
  poll: 'collector.poll',
  sweep: 'collector.sweep',
  clans: 'collector.clans',
  reference: 'collector.reference',
  aggregate: 'collector.aggregate',
  news: 'collector.news',
  purge: 'collector.purge',
  developerWebhooks: 'developer.webhooks'
} as const;

export const JOB = {
  enrol: { enrol: 'enrol' },
  poll: { dispatch: 'dispatch', batch: 'batch' },
  sweep: { dispatch: 'dispatch', dormantDispatch: 'dormant-dispatch', batch: 'batch', seed: 'seed' },
  clans: { dispatch: 'dispatch', refresh: 'refresh', history: 'history' },
  reference: {
    versionCheck: 'version-check',
    encyclopedia: 'encyclopedia',
    wn8Expected: 'wn8-expected',
    moeThresholds: 'moe-thresholds',
    masteryThresholds: 'mastery-thresholds',
    englishNames: 'english-names'
  },
  aggregate: {
    accountRatings: 'account-ratings',
    serverStats: 'server-stats',
    tankPercentiles: 'tank-percentiles',
    tierMaintenance: 'tier-maintenance',
    tankEconomy: 'tank-economy',
    learningCurve: 'learning-curve',
    buildUsage: 'build-usage',
    modeMeta: 'mode-meta'
  },
  news: { rss: 'rss' },
  purge: { dispatch: 'dispatch', account: 'account', retention: 'retention' },
  developerWebhooks: { deliver: 'deliver', closeSessions: 'close-sessions', redrive: 'redrive' }
} as const;

export const ENROL_REASONS = ['search', 'view', 'favorite', 'follow', 'login', 'mod', 'manual'] as const;

export const ENROL_PRIORITY = {
  high: 1,
  normal: 10
} as const;

export const CLAN_DISPATCH_SCOPES = ['tracked', 'all'] as const;
