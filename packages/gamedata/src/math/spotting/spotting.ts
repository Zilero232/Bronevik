import type {
  CamouflageFactorInput,
  SpottingDistanceInput,
  SpottingDuel,
  SpottingDuelInput,
  SpottingVerdict,
  ViewRangeInput
} from './spotting.types';

import { SPOTTING } from './spotting.constants';

const toUnit = (value: number): number => Math.min(SPOTTING.maxCamouflage, Math.max(0, value));

const verdictOf = (margin: number): SpottingVerdict => {
  if (Math.abs(margin) < SPOTTING.evenMargin) {
    return 'even';
  }

  return margin > 0 ? 'me' : 'them';
};

export const camouflageFactor = ({ camouflage, state }: CamouflageFactorInput): number => {
  const base = state.isMoving ? camouflage.moving : camouflage.still;
  const skill = 1 + (state.camoSkillRate ?? SPOTTING.camoSkillRate) * Math.max(0, state.camoSkill);
  const own = base * skill * (state.isFiring ? camouflage.atShot : 1);
  const paint = state.hasPaint ? (camouflage.camouflageBonus ?? 0) : 0;
  const net = state.hasCamoNet && !state.isMoving ? camouflage.camoNet : 0;
  const foliage = SPOTTING.foliage[state.foliage] * (state.isFiring && state.isFoliageNear ? SPOTTING.nearFoliageAtShot : 1);

  return toUnit(own + paint + net + foliage);
};

export const effectiveViewRange = ({ viewRange, state }: ViewRangeInput): number =>
  viewRange *
  (state.hasOptics ? SPOTTING.optics : 1) *
  (state.hasBinoculars && !state.isMoving ? SPOTTING.binoculars : 1) *
  (1 + (state.hasCrewSkills ? SPOTTING.crewVisionBonus : 0));

export const spottingDistance = ({ viewRange, camouflage }: SpottingDistanceInput): number => {
  const reach = viewRange - (viewRange - SPOTTING.minDistance) * toUnit(camouflage);

  return Math.min(SPOTTING.maxDistance, Math.max(SPOTTING.minDistance, reach));
};

export const spottingDuel = ({ mine, theirs }: SpottingDuelInput): SpottingDuel => {
  const iSpotAt = spottingDistance({ viewRange: mine.viewRange, camouflage: theirs.camouflage });
  const theySpotAt = spottingDistance({ viewRange: theirs.viewRange, camouflage: mine.camouflage });
  const margin = iSpotAt - theySpotAt;

  return { iSpotAt, theySpotAt, margin, verdict: verdictOf(margin) };
};
