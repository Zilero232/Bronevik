import type { SpottingFormValues, SpottingSideValues } from '../lib/spotting-form';

const SIDE_DEFAULTS: SpottingSideValues = {
  isMoving: false,
  isFiring: false,
  foliage: 'none',
  isFoliageNear: false,
  hasCamoNet: false,
  hasPaint: false,
  camoSkill: 0,
  hasOptics: false,
  hasBinoculars: false,
  hasCrewSkills: false
};

export const SPOTTING_FORM_DEFAULTS: SpottingFormValues = {
  targetId: null,
  me: SIDE_DEFAULTS,
  them: SIDE_DEFAULTS
};
