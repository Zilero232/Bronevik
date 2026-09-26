import type { VehicleSpec } from '../../model';
import type { FOLIAGE_KINDS } from './spotting.constants';

export type FoliageKind = (typeof FOLIAGE_KINDS)[number];

export type Camouflage = Pick<VehicleSpec['invisibility'], 'camouflageBonus' | 'moving' | 'still'> & {
  atShot: number;
  camoNet: number;
};

export type SpottingState = {
  isMoving: boolean;
  isFiring: boolean;
  foliage: FoliageKind;
  isFoliageNear: boolean;
  hasCamoNet: boolean;
  hasPaint: boolean;
  camoSkill: number;
  camoSkillRate?: number;
};

export type CamouflageFactorInput = {
  camouflage: Camouflage;
  state: SpottingState;
};

export type VisionState = {
  isMoving: boolean;
  hasOptics: boolean;
  hasBinoculars: boolean;
  hasCrewSkills: boolean;
};

export type ViewRangeInput = {
  viewRange: number;
  state: VisionState;
};

export type SpottingDistanceInput = {
  viewRange: number;
  camouflage: number;
};

export type SpottingSide = SpottingDistanceInput;

export type SpottingDuelInput = {
  mine: SpottingSide;
  theirs: SpottingSide;
};

export type SpottingVerdict = 'even' | 'me' | 'them';

export type SpottingDuel = {
  iSpotAt: number;
  theySpotAt: number;
  margin: number;
  verdict: SpottingVerdict;
};
