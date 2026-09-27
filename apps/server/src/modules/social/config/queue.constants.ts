export const SOCIAL_QUEUE = {
  name: 'social',
  jobs: { challenges: 'challenges', leagues: 'leagues' }
} as const;

export const SOCIAL_SCHEDULES = [
  {
    id: 'social-challenges',
    queue: SOCIAL_QUEUE.name,
    name: SOCIAL_QUEUE.jobs.challenges,
    repeat: { pattern: '35 * * * *' }
  },
  {
    id: 'social-leagues',
    queue: SOCIAL_QUEUE.name,
    name: SOCIAL_QUEUE.jobs.leagues,
    repeat: { pattern: '5 * * * *' }
  }
] as const;
