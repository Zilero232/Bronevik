import type { MeSection, PlayerSectionKeyInput } from './query-keys.types';

export const QUERY_KEYS = {
  search: (query: string) => ['search', query] as const,
  player: {
    profile: (idOrNick: string) => ['player', 'profile', idOrNick.toLowerCase()] as const,
    popular: (params: object) => ['player', 'popular', params] as const,
    section: ({ accountId, section, params = {} }: PlayerSectionKeyInput) => ['player', accountId, section, params] as const
  },
  leaderboard: (params: object) => ['leaderboard', params] as const,
  comparePlayers: (params: object) => ['compare', 'players', params] as const,
  compareTanks: (tankIds: readonly number[]) => ['compare', 'tanks', tankIds] as const,
  tanks: {
    stats: (params: object) => ['tanks', 'stats', params] as const,
    tierList: (params: object) => ['tanks', 'tier-list', params] as const,
    catalog: ['tanks', 'catalog'] as const,
    detail: (params: object) => ['tanks', 'detail', params] as const,
    topPlayers: (params: object) => ['tanks', 'top-players', params] as const,
    trend: (tankId: number) => ['tanks', tankId, 'trend'] as const,
    patches: (tankId: number) => ['tanks', tankId, 'patches'] as const,
    armor: (idOrSlug: string) => ['tanks', 'armor', idOrSlug] as const
  },
  marks: {
    list: (params: object) => ['marks', 'list', params] as const,
    history: (tankId: number) => ['marks', tankId, 'history'] as const,
    historyBatch: (params: object) => ['marks', 'history-batch', params] as const,
    projection: (params: object) => ['marks', 'projection', params] as const,
    player: (accountId: number) => ['marks', 'player', accountId] as const
  },
  builds: {
    options: (tankId: number) => ['builds', tankId, 'options'] as const,
    stats: (params: object) => ['builds', 'stats', params] as const,
    popular: (tankId: number) => ['builds', tankId, 'popular'] as const
  },
  tree: (nation: string) => ['tree', nation] as const,
  pulse: ['pulse'] as const,
  clans: {
    list: (params: object) => ['clans', 'list', params] as const,
    page: (idOrTag: string) => ['clans', 'page', idOrTag.toLowerCase()] as const,
    events: (params: object) => ['clans', 'events', params] as const,
    stronghold: (clanId: number) => ['clans', clanId, 'stronghold'] as const
  },
  maps: {
    list: ['maps', 'list'] as const,
    detail: (id: string) => ['maps', 'detail', id] as const
  },
  auth: {
    session: ['auth', 'session'] as const,
    telegramWidget: ['auth', 'telegram-widget'] as const
  },
  me: {
    all: ['me'] as const,
    section: (section: MeSection) => ['me', section] as const,
    developer: {
      overview: ['me', 'developer', 'overview'] as const,
      keys: ['me', 'developer', 'keys'] as const,
      usage: (params: object) => ['me', 'developer', 'usage', params] as const,
      errors: (keyId: string) => ['me', 'developer', 'errors', keyId] as const,
      webhooks: ['me', 'developer', 'webhooks'] as const,
      deliveries: (webhookId: string) => ['me', 'developer', 'deliveries', webhookId] as const
    },
    billing: {
      status: ['me', 'billing', 'status'] as const,
      history: ['me', 'billing', 'history'] as const
    },
    inbox: (params: object) => ['me', 'inbox', params] as const,
    telegram: ['me', 'telegram'] as const,
    streamer: {
      profile: ['me', 'streamer', 'profile'] as const,
      overlays: ['me', 'streamer', 'overlays'] as const,
      challenges: ['me', 'streamer', 'challenges'] as const,
      integrations: ['me', 'streamer', 'integrations'] as const
    }
  },
  billing: {
    plans: ['billing', 'plans'] as const
  },
  developer: {
    spec: ['developer', 'openapi'] as const
  },
  notifications: {
    pushKey: ['notifications', 'push-key'] as const
  },
  streamers: {
    profile: (slug: string) => ['streamers', 'profile', slug.toLowerCase()] as const,
    overlay: (publicId: string) => ['streamers', 'overlay', publicId] as const
  }
} as const;
