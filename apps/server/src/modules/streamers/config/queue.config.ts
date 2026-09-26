export const STREAMERS_QUEUE = {
  name: 'streamers.events',
  jobs: {
    battleFeed: 'battle-feed',
    predictionOpen: 'prediction-open',
    expireChallenges: 'expire-challenges',
    livePoll: 'live-poll',
    settingsAggregate: 'settings-aggregate'
  }
} as const;

export const STREAMERS_SCHEDULES = [
  { id: 'streamers-battle-feed', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.battleFeed, repeat: { every: 10_000 } },
  { id: 'streamers-expire-challenges', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.expireChallenges, repeat: { every: 60_000 } },
  { id: 'streamers-live-poll', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.livePoll, repeat: { every: 60_000 } },
  { id: 'streamers-settings-aggregate', queue: STREAMERS_QUEUE.name, name: STREAMERS_QUEUE.jobs.settingsAggregate, repeat: { pattern: '20 4 * * *' } }
] as const;
