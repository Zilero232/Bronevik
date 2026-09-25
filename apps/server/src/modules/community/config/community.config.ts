import type { ClanRole } from '../../../../generated';

import { FEATURES } from '../../../config';

export const COMMUNITY_QUEUE = {
  name: 'community',
  jobs: { expirePosts: 'expire-posts', settleCoaching: 'settle-coaching' }
} as const;

export const COMMUNITY_SCHEDULES = [
  {
    id: 'community-expire-posts',
    queue: COMMUNITY_QUEUE.name,
    name: COMMUNITY_QUEUE.jobs.expirePosts,
    repeat: { every: 10 * 60_000 },
    enabled: FEATURES.communityMaintenance
  },
  {
    id: 'community-settle-coaching',
    queue: COMMUNITY_QUEUE.name,
    name: COMMUNITY_QUEUE.jobs.settleCoaching,
    repeat: { every: 5 * 60_000 },
    enabled: FEATURES.communityMaintenance
  }
] as const;

export const BUILD_SHARE = {
  popularLimit: 10
} as const;

export const GUIDES = {
  maxBodyLength: 50_000,
  authorsLimit: 20
} as const;

export const COMMENTS = {
  maxBodyLength: 4000,
  pageLimit: 100
} as const;

export const PLATOON = {
  defaultHours: 3,
  maxHours: 24,
  maxOpenPerUser: 1
} as const;

export const RECRUITING = {
  defaultDays: 14,
  maxDays: 60,
  officerRoles: ['commander', 'executiveOfficer', 'personnelOfficer', 'recruitmentOfficer', 'combatOfficer'] as const satisfies readonly ClanRole[]
} as const;

export const COACHING = {
  minPriceRub: 100,
  maxPriceRub: 100_000,
  returnPath: '/community/coaching/orders',
  product: 'coaching',
  settleLookbackDays: 3
} as const;

export const TOURNAMENT = {
  minParticipants: 2,
  maxParticipants: 256
} as const;

export const MODERATION = {
  roles: ['admin', 'moderator'],
  reportThrottle: { limit: 10, ttl: 60_000 },
  pageLimit: 100
} as const;

export const TACTICS = {
  path: '/tactics/ws',
  documentPrefix: 'board:',
  debounceMs: 2000,
  maxDebounceMs: 10_000,
  maxBoardsPerUser: 200
} as const;

export const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

export const BUILD_INCLUDE = { author: { select: AUTHOR_SELECT }, gameVersion: { select: { version: true } } } as const;

export const GUIDE_INCLUDE = { author: { select: AUTHOR_SELECT } } as const;
