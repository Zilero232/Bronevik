export const FOLIAGE_KINDS = ['none', 'sparse', 'single', 'double'] as const;

export const SPOTTING = {
  minDistance: 50,
  maxDistance: 445,
  maxCamouflage: 1,
  evenMargin: 1,
  nearFoliageAtShot: 0.3,
  foliage: { none: 0, sparse: 0.25, single: 0.5, double: 0.8 },
  optics: 1.1,
  binoculars: 1.25,
  crewVisionBonus: 0.05,
  camoSkillRate: 0.0075
} as const;
