import type { QueueCell } from '../../map-stats.types';
import type { QueueTimeRow } from '../../queries';

export const toQueueCell = (row: QueueTimeRow): QueueCell => ({
  tier: row.tier,
  hour: row.hour,
  samples: row.samples,
  avgSec: row.avgSec,
  medianSec: row.medianSec,
  p90Sec: row.p90Sec
});
