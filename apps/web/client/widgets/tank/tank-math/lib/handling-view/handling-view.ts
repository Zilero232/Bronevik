import type { GunHandling, HandlingScenario } from '@otmetki/gamedata';

import { aimCurve, aimTimeline, handlingScore, scenarioAims, scenarioMotion } from '@otmetki/gamedata';

import type { HandlingCurves, HandlingRow, HandlingRowId, HandlingRowsInput } from './handling-view.types';

import { HANDLING_ROWS } from '../../config';

const valuesOf = (handling: GunHandling): Record<HandlingRowId, number> => {
  const aims = scenarioAims(handling);
  const aimOf = (scenario: HandlingScenario): number => aims.find((aim) => aim.scenario === scenario)?.aimTime ?? 0;

  return {
    score: handlingScore(handling),
    aimingTime: handling.aimingTime,
    dispersion: handling.dispersion,
    'aim.move': aimOf('move'),
    'aim.hull': aimOf('hull'),
    'aim.turret': aimOf('turret'),
    'aim.shot': aimOf('shot'),
    'aim.full': aimOf('full')
  };
};

export const handlingCurves = (handling: GunHandling): HandlingCurves => {
  const times = aimTimeline(handling);

  return {
    times,
    series: scenarioAims(handling).map(({ scenario }) => ({
      scenario,
      values: aimCurve({ handling, motion: scenarioMotion({ handling, scenario }), times }).map((point) => point.dispersion)
    }))
  };
};

export const handlingRows = ({ handling, other }: HandlingRowsInput): HandlingRow[] => {
  const mine = valuesOf(handling);
  const theirs = other ? valuesOf(other) : null;

  return HANDLING_ROWS.map((id) => ({ id, value: mine[id], delta: theirs ? mine[id] - theirs[id] : null }));
};
