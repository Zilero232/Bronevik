import type { Prisma } from '../../../../generated';

export const LINK_CODE = {
  length: 8,
  alphabet: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789',
  ttlMinutes: 15
} as const;

export const WEB_LOGIN = {
  bytes: 32,
  ttlMinutes: 10,
  path: '/login/telegram',
  throttle: { ttl: 60_000, limit: 10 }
} as const;

export const LINK_CONFIRM = {
  prefix: 'tglink:',
  yes: 'yes',
  no: 'no'
} as const;

export const DISPOSABLE_USER_COUNTS = {
  lestaAccounts: true,
  follows: true,
  goals: true,
  pushSubscriptions: true,
  modDevices: true,
  apiKeys: true,
  webhookEndpoints: true,
  subscriptions: true,
  payments: true,
  promoRedemptions: true,
  referralsMade: true,
  streamerIntegrations: true,
  streamerClaims: true,
  streamerFollows: true,
  settingsApplies: true,
  overlays: true,
  challenges: true,
  replays: true,
  builds: true,
  guides: true,
  reactions: true,
  comments: true,
  platoonPosts: true,
  recruitingPosts: true,
  tacticBoards: true,
  coachingOrders: true,
  tournaments: true,
  clanWorkspaces: true,
  recruitCandidates: true,
  bonusCodeReports: true,
  missionProgress: true,
  shellLedger: true,
  seasonProgress: true,
  cosmetics: true,
  contentReports: true,
  competitions: true,
  competitionEntries: true
} as const satisfies Prisma.UserCountOutputTypeSelect;
