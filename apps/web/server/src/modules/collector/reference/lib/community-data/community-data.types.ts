import type { MasteryThresholdRecord, MoeThresholdRecord } from '../../../../reference';

export type MoeThresholdRow = Pick<MoeThresholdRecord, 'p65' | 'p85' | 'p95' | 'tankId'>;

export type MasteryThresholdRow = Pick<MasteryThresholdRecord, 'class1' | 'class2' | 'class3' | 'master' | 'tankId'>;

export type ExpectedValuesDateInput = {
  header: Record<string, unknown>;
  now: Date;
};
