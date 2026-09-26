import type { MasteryThreshold, MoeThreshold } from '../../../../../../generated';

export type MoeThresholdRow = Pick<MoeThreshold, 'p65' | 'p85' | 'p95' | 'tankId'>;

export type MasteryThresholdRow = Pick<MasteryThreshold, 'class1' | 'class2' | 'class3' | 'master' | 'tankId'>;

export type ExpectedValuesDateInput = {
  header: Record<string, unknown>;
  now: Date;
};
