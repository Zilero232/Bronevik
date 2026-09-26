export const HOW_TO_BUILD = {
  skeletonHeight: 360,
  historySkeletonHeight: 120,
  picksPerSlot: 3,
  picksPerList: 4,
  skillsPerRole: 5,
  shells: 3,
  historyRows: 8,
  iconSize: 28
} as const;

export const CREW_ROLE_ORDER = ['commander', 'gunner', 'driver', 'radioman', 'loader'] as const;

export const SHELL_KINDS = ['ARMOR_PIERCING', 'ARMOR_PIERCING_CR', 'HIGH_EXPLOSIVE', 'HOLLOW_CHARGE', 'ARMOR_PIERCING_HE', 'FLAME'] as const;
