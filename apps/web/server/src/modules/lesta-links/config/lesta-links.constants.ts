export const LESTA_LINKS = {
  garage: {
    fields: ['tank_id', 'in_garage'],
    resyncAfterHours: 20,
    dispatchBatch: 500,
    jobPrefix: 'garage'
  },
  token: {
    renewWithinDays: 3,
    extendDays: 13,
    batch: 200
  },
  concurrency: 2
} as const;
