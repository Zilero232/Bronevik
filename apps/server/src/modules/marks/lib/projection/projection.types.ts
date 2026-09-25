type ProjectionThresholds = {
  p65: number;
  p85: number;
  p95: number;
  p100: number | null;
};

export type ProjectMarksInput = {
  thresholds: ProjectionThresholds;
  currentPercent: number | null;
  targetMarks: number;
  avgDamage: number;
};
