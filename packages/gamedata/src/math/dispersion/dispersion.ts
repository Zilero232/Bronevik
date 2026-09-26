import type {
  AimCurveInput,
  AimCurvePoint,
  DispersionAfterInput,
  DispersionFactorInput,
  GunHandling,
  HandlingMotion,
  ScenarioAim,
  ScenarioMotionInput
} from './dispersion.types';

import { DISPERSION, HANDLING_SCENARIOS } from './dispersion.constants';

export const dispersionFactor = ({ handling, motion }: DispersionFactorInput): number => {
  const movement = handling.dispersionMovement * (motion.speed ?? 0);
  const hull = handling.dispersionHullRotation * (motion.hullRotation ?? 0);
  const turret = handling.dispersionTurretRotation * (motion.turretRotation ?? 0);
  const shot = motion.isShot ? handling.dispersionAfterShot : 0;

  return Math.sqrt(1 + movement ** 2 + hull ** 2 + turret ** 2 + shot ** 2);
};

export const aimTime = (input: DispersionFactorInput): number =>
  input.handling.aimingTime > 0 ? input.handling.aimingTime * Math.log(dispersionFactor(input)) : 0;

export const dispersionAfter = ({ elapsed, ...input }: DispersionAfterInput): number => {
  const { handling } = input;
  const decay = handling.aimingTime > 0 ? Math.exp(-Math.max(0, elapsed) / handling.aimingTime) : 0;

  return handling.dispersion * Math.max(1, dispersionFactor(input) * decay);
};

export const aimCurve = ({ times, ...input }: AimCurveInput): AimCurvePoint[] =>
  times.map((time) => ({ time, dispersion: dispersionAfter({ ...input, elapsed: time }) }));

export const scenarioMotion = ({ handling, scenario }: ScenarioMotionInput): HandlingMotion => {
  switch (scenario) {
    case 'move': {
      return { speed: handling.speedForward };
    }

    case 'hull': {
      return { hullRotation: handling.hullTraverse };
    }

    case 'turret': {
      return { turretRotation: handling.turretTraverse };
    }

    case 'shot': {
      return { isShot: true };
    }

    case 'full': {
      return { speed: handling.speedForward, turretRotation: handling.turretTraverse };
    }
  }
};

export const scenarioAims = (handling: GunHandling): ScenarioAim[] =>
  HANDLING_SCENARIOS.map((scenario) => {
    const motion = scenarioMotion({ handling, scenario });
    const factor = dispersionFactor({ handling, motion });

    return { scenario, factor, bloom: handling.dispersion * factor, aimTime: aimTime({ handling, motion }) };
  });

export const handlingScore = (handling: GunHandling): number =>
  dispersionAfter({ handling, motion: scenarioMotion({ handling, scenario: 'full' }), elapsed: DISPERSION.snapDelay });

export const aimTimeline = (handling: GunHandling): number[] => {
  const longest = Math.max(0, ...scenarioAims(handling).map((item) => item.aimTime)) * DISPERSION.curveMargin;
  const steps = Math.max(1, Math.ceil(longest / DISPERSION.curveStep));

  return Array.from({ length: steps + 1 }, (_, index) => index * DISPERSION.curveStep);
};
