import type { MissionMetric } from '@otmetki/schemas';

export type MetricCellProps = {
  value: number | null;
  metric?: MissionMetric;
};
