import type { MissionMetric } from '@otmetki/schemas';

export type MetricCondition = {
  progressId: string;
  isMain: boolean;
  isHeader: boolean;
};

export type MissionMetricChoice = {
  metric: MissionMetric;
  progressId: string | null;
};
