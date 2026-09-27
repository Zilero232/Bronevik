import type { AverageCurveInput, AverageCurvePoint, BattlesToAverageInput, RunningAverageInput, TargetOutcome } from './battles-to-target.types';

export const battlesToAverage = ({ battles, current, expected, target }: BattlesToAverageInput): TargetOutcome => {
  if (current >= target) {
    return { kind: 'done' };
  }

  if (expected <= target) {
    return { kind: 'impossible' };
  }

  if (battles <= 0) {
    return { kind: 'battles', battles: 1 };
  }

  return { kind: 'battles', battles: Math.ceil((battles * (target - current)) / (expected - target)) };
};

export const runningAverage = ({ battles, current, expected, added }: RunningAverageInput): number =>
  battles + added === 0 ? current : (battles * current + added * expected) / (battles + added);

export const averageCurve = ({ battles, current, expected, horizon, points }: AverageCurveInput): AverageCurvePoint[] => {
  const step = Math.max(1, Math.ceil(horizon / points));
  const count = Math.ceil(horizon / step);

  return Array.from({ length: count + 1 }, (_, index) => {
    const added = Math.min(index * step, horizon);

    return { battle: added, value: runningAverage({ battles, current, expected, added }) };
  });
};
