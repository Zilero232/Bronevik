export const EVENTS_QUEUE = {
  name: 'events',
  jobs: { calendar: 'calendar', drops: 'drops' }
} as const;

export const EVENTS_SCHEDULES = [
  {
    id: 'events-calendar',
    queue: EVENTS_QUEUE.name,
    name: EVENTS_QUEUE.jobs.calendar,
    repeat: { pattern: '25 */4 * * *' }
  },
  { id: 'events-drops', queue: EVENTS_QUEUE.name, name: EVENTS_QUEUE.jobs.drops, repeat: { every: 30 * 60_000 } }
] as const;
