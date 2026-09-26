import type { BallisticsCurveInput, BallisticsPoint, ShellAtDistanceInput } from './ballistics.types';

import { penetrationAtDistance, toShellKind } from '../../armor';
import { BALLISTICS } from './ballistics.constants';

export const penetrationAt = ({ shell, distance }: ShellAtDistanceInput): number =>
  penetrationAtDistance({ kind: toShellKind(shell.kind), at100m: shell.penetration100m, at500m: shell.penetration500m, distance });

export const flightTime = ({ shell, distance }: ShellAtDistanceInput): number | null => {
  if (distance < 0 || distance > shell.maxDistance || shell.speed <= 0) {
    return null;
  }

  const lift = (shell.gravity * distance) / shell.speed ** 2;

  if (lift > 1) {
    return null;
  }

  const elevation = Math.asin(lift) / 2;

  return distance / (shell.speed * Math.cos(elevation));
};

export const ballisticsCurve = ({ shell, distances }: BallisticsCurveInput): BallisticsPoint[] =>
  distances.map((distance) => ({ distance, penetration: penetrationAt({ shell, distance }), flightTime: flightTime({ shell, distance }) }));

export const ballisticsDistances = (maxDistance: number = BALLISTICS.maxDistance): number[] =>
  Array.from({ length: Math.floor(maxDistance / BALLISTICS.step) + 1 }, (_, index) => index * BALLISTICS.step);
