import { FEATURES } from '../../../config';

export const COMMUNITY_QUEUE = {
  name: 'community',
  jobs: { expirePosts: 'expire-posts' }
} as const;

export const COMMUNITY_SCHEDULES = [
  {
    id: 'community-expire-posts',
    queue: COMMUNITY_QUEUE.name,
    name: COMMUNITY_QUEUE.jobs.expirePosts,
    repeat: { every: 10 * 60_000 },
    enabled: FEATURES.communityMaintenance
  }
] as const;
