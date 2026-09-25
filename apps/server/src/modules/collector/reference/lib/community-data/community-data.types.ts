export type MoeThresholdRow = {
  tankId: number;
  p65: number;
  p85: number;
  p95: number;
};

export type MasteryThresholdRow = {
  tankId: number;
  class3: number;
  class2: number;
  class1: number;
  master: number;
};

export type ExpectedValuesDateInput = {
  header: Record<string, unknown>;
  now: Date;
};
