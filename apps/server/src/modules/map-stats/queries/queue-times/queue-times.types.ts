import type { QueueTimeAggregate } from '../../../../../generated';

export type QueueTimeRow = Pick<QueueTimeAggregate, 'avgSec' | 'hour' | 'medianSec' | 'mode' | 'p90Sec' | 'samples' | 'tier'>;
