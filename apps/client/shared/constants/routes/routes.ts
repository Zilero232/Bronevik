import type { MissionOperationRouteInput, PlayerSessionRouteInput } from './routes.types';

export const ROUTES = {
  home: '/',
  design: '/design',
  auth: {
    login: '/login',
    telegram: '/login/telegram'
  },
  players: {
    list: '/players',
    profile: (nickname: string) => `/p/${encodeURIComponent(nickname)}`,
    session: ({ nickname, sessionId }: PlayerSessionRouteInput) => `/p/${encodeURIComponent(nickname)}/sessions/${sessionId}`,
    compare: '/compare/players'
  },
  top: '/top',
  tanks: {
    list: '/tanks',
    detail: (slug: string) => `/t/${slug}`,
    armor: (slug: string) => `/t/${slug}/armor`,
    compare: '/tanks/compare'
  },
  builds: {
    list: '/builds',
    detail: (slug: string) => `/builds/${slug}`
  },
  tree: '/tree',
  marks: '/marks',
  modes: {
    list: '/modes',
    detail: (mode: string) => `/modes/${encodeURIComponent(mode)}`
  },
  maps: {
    list: '/maps',
    detail: (id: string) => `/maps/${encodeURIComponent(id)}`
  },
  play: {
    guessTank: '/play/guess-tank'
  },
  missions: {
    hub: '/missions',
    operation: ({ campaign, operation }: MissionOperationRouteInput) => `/missions/${campaign}/${operation}`
  },
  clans: {
    list: '/clans',
    detail: (tag: string) => `/c/${encodeURIComponent(tag)}`
  },
  tools: '/tools',
  codes: '/codes',
  news: '/news',
  shop: '/shop',
  events: '/events',
  pulse: '/pulse',
  streamers: {
    list: '/streamers',
    profile: (slug: string) => `/s/${encodeURIComponent(slug)}`,
    claim: (slug: string) => `/s/${encodeURIComponent(slug)}/claim`,
    overlay: (publicId: string) => `/overlay/${encodeURIComponent(publicId)}`,
    forStreamers: '/for-streamers',
    settings: {
      table: '/streamers/settings',
      compare: '/streamers/settings/compare',
      profile: (slug: string) => `/s/${encodeURIComponent(slug)}/settings`
    }
  },
  developers: '/developers',
  plus: '/plus',
  replays: {
    list: '/replays',
    detail: (id: string) => `/replays/${encodeURIComponent(id)}`
  },
  tactics: {
    list: '/tactics',
    board: (id: string) => `/tactics/${encodeURIComponent(id)}`
  },
  guides: {
    list: '/guides',
    detail: (slug: string) => `/guides/${encodeURIComponent(slug)}`,
    create: '/guides/new',
    edit: (slug: string) => `/guides/${encodeURIComponent(slug)}/edit`
  },
  platoons: '/platoons',
  recruiting: '/recruiting',
  coaching: {
    list: '/coaching',
    coach: (userId: string) => `/coaching/${encodeURIComponent(userId)}`
  },
  tournaments: {
    list: '/tournaments',
    detail: (slug: string) => `/tournaments/${encodeURIComponent(slug)}`,
    points: '/tournaments?tab=points'
  },
  competitions: {
    detail: (slug: string) => `/competitions/${encodeURIComponent(slug)}`
  },
  miniApp: '/tg',
  account: {
    overview: '/me',
    progress: '/me/progress',
    cosmetics: '/me/cosmetics',
    analytics: '/me/analytics',
    battles: '/me/battles',
    battle: (id: string) => `/me/battles/${encodeURIComponent(id)}`,
    developer: '/me/developer',
    billing: '/me/billing',
    notifications: '/me/notifications',
    telegram: '/me/telegram',
    streamer: '/me/streamer',
    watchlist: '/me/watchlist'
  },
  api: {
    playerCard: (accountId: number) => `/api/og/player/${accountId}`
  },
  sw: '/serwist/sw.js'
} as const;
