import type { Queue } from 'bullmq';

export type SampleQueueInput = {
  queue: Queue;
  now: Date;
};

export type QueueSample = {
  name: string;
  counts: Awaited<ReturnType<Queue['getJobCounts']>>;
  lagSeconds: number;
  queueDepth: number;
};
