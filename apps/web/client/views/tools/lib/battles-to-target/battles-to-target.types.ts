export type BattlesToAverageInput = {
  battles: number;
  current: number;
  expected: number;
  target: number;
};

export type TargetOutcome = { kind: 'battles'; battles: number } | { kind: 'done' } | { kind: 'impossible' };

export type RunningAverageInput = {
  battles: number;
  current: number;
  expected: number;
  added: number;
};

export type AverageCurveInput = {
  battles: number;
  current: number;
  expected: number;
  horizon: number;
  points: number;
};

export type AverageCurvePoint = {
  battle: number;
  value: number;
};
