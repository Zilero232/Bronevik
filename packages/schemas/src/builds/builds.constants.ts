export const BUILD_OPTIONS = {
  profiles: ['stock', 'top'],
  provisionKinds: ['optionalDevice', 'consumable', 'directive', 'fieldModification'],
  maxSpecializedSlots: 3
} as const;

export const POPULAR_BUILDS = {
  sources: ['battles', 'builds', 'none'],
  defaultLimit: 5,
  maxLimit: 20
} as const;

export const BUILD_USAGE = {
  modes: ['random', 'onslaught', 'frontline', 'ranked'],
  cohorts: ['all', 'top10', 'top1'],
  freeCohorts: ['all', 'top10'],
  plusCohorts: ['top1'],
  defaultMode: 'random',
  defaultCohort: 'top10',
  catalogCohort: 'all',
  minSample: 30,
  windowDays: 30,
  catalogTopPicks: 3
} as const;
