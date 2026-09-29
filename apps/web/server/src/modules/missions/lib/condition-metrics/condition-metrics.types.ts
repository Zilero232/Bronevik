import type { MissionCondition, MissionMetric } from '@otmetki/schemas';

export type MetricCondition = Pick<MissionCondition, 'isHeader' | 'isMain' | 'progressId'>;

export type MissionMetricChoice = {
  metric: MissionMetric;
  progressId: string | null;
};
