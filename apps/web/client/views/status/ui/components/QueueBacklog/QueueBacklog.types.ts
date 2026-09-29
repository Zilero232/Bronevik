import type { QueueBacklog } from '@otmetki/schemas';

export type QueueBacklogProps = {
  queues: QueueBacklog[];
  collectedAt: string | null;
};
