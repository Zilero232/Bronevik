export { BALLISTICS, ballisticsCurve, ballisticsDistances, flightTime, penetrationAt } from './ballistics';
export type { BallisticsCurveInput, BallisticShell, BallisticsPoint, ShellAtDistanceInput } from './ballistics';
export {
  aimCurve,
  aimTime,
  aimTimeline,
  DISPERSION,
  dispersionAfter,
  dispersionFactor,
  HANDLING_SCENARIOS,
  handlingScore,
  scenarioAims,
  scenarioMotion
} from './dispersion';
export type {
  AimCurveInput,
  AimCurvePoint,
  DispersionAfterInput,
  DispersionFactorInput,
  GunHandling,
  HandlingMotion,
  HandlingScenario,
  ScenarioAim,
  ScenarioMotionInput
} from './dispersion';
export { camouflageFactor, effectiveViewRange, FOLIAGE_KINDS, SPOTTING, spottingDistance, spottingDuel } from './spotting';
export type {
  Camouflage,
  CamouflageFactorInput,
  FoliageKind,
  SpottingDistanceInput,
  SpottingDuel,
  SpottingDuelInput,
  SpottingSide,
  SpottingState,
  SpottingVerdict,
  ViewRangeInput,
  VisionState
} from './spotting';
