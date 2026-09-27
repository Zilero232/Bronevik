import { ballisticsCurve, ballisticsDistances, flightTime, penetrationAt } from '@otmetki/gamedata';

import type { TankMathShell } from '../../api';
import type { BallisticsSeries, ShellRow } from './ballistics-view.types';

import { TANK_MATH } from '../../config';

const penetrations = (shell: TankMathShell): number[] => TANK_MATH.penetrationDistances.map((distance) => penetrationAt({ shell, distance }));

export const ballisticsSeries = (shells: readonly TankMathShell[]): BallisticsSeries => {
  const reach = Math.min(...shells.map((shell) => shell.maxDistance));
  const distances = ballisticsDistances(Number.isFinite(reach) ? reach : undefined);
  const curves = shells.map((shell) => ({ shell: shell.shell, points: ballisticsCurve({ shell, distances }) }));

  return {
    distances,
    penetration: curves.map(({ shell, points }) => ({ shell, values: points.map((point) => point.penetration) })),
    flightTime: curves.map(({ shell, points }) => ({ shell, values: points.map((point) => point.flightTime ?? 0) }))
  };
};

export const shellRows = (shells: readonly TankMathShell[]): ShellRow[] => {
  const [reference] = shells;
  const referencePenetration = reference ? penetrations(reference) : null;
  const referenceFlight = reference ? flightTime({ shell: reference, distance: TANK_MATH.flightDistance }) : null;

  return shells.map((shell, index) => {
    const penetration = penetrations(shell);
    const time = flightTime({ shell, distance: TANK_MATH.flightDistance });
    const isCompared = index > 0 && referencePenetration !== null;

    return {
      shell: shell.shell,
      kind: shell.kind,
      caliber: shell.caliber,
      isPremium: shell.isPremium,
      damage: shell.damage,
      speed: shell.speed,
      penetration,
      flightTime: time,
      penetrationDelta: isCompared ? penetration.map((value, at) => value - (referencePenetration[at] ?? value)) : null,
      flightTimeDelta: isCompared && time !== null && referenceFlight !== null ? time - referenceFlight : null
    };
  });
};
