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
