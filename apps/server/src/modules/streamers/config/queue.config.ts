export const STREAMERS_QUEUE = {
  name: 'streamers.events',
  jobs: { battleFeed: 'battle-feed', expireChallenges: 'expire-challenges' }
} as const;

export const STREAMERS_SCHEDULES = [
  { id: 'streamers-battle-feed', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.battleFeed, repeat: { every: 10_000 } },
  { id: 'streamers-expire-challenges', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.expireChallenges, repeat: { every: 60_000 } }
] as const;
