import type { FinalStats } from '../../loadout';
import type { HANDLING_SCENARIOS } from './dispersion.constants';

export type GunHandling = Pick<
  FinalStats,
  | 'aimingTime'
  | 'dispersion'
  | 'dispersionAfterShot'
  | 'dispersionHullRotation'
  | 'dispersionMovement'
  | 'dispersionTurretRotation'
  | 'hullTraverse'
  | 'speedForward'
  | 'turretTraverse'
>;

export type HandlingMotion = {
  speed?: number;
  hullRotation?: number;
  turretRotation?: number;
  isShot?: boolean;
};

export type HandlingScenario = (typeof HANDLING_SCENARIOS)[number];

export type DispersionFactorInput = {
  handling: GunHandling;
  motion: HandlingMotion;
};

export type DispersionAfterInput = DispersionFactorInput & {
  elapsed: number;
};

export type AimCurveInput = DispersionFactorInput & {
  times: readonly number[];
};

export type AimCurvePoint = {
  time: number;
  dispersion: number;
};

export type ScenarioMotionInput = {
  handling: GunHandling;
  scenario: HandlingScenario;
};

export type ScenarioAim = {
  scenario: HandlingScenario;
  factor: number;
  bloom: number;
  aimTime: number;
};
