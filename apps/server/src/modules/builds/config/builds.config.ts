import type { ProvisionKind } from '@bronevik/schemas';

import type { ProvisionType } from '../../../../generated';

export const PROVISION_KIND = {
  optionalDevice: 'optionalDevice',
  equipment: 'consumable',
  consumable: 'consumable',
  directive: 'directive',
  fieldModification: 'fieldModification'
} as const satisfies Record<ProvisionType, ProvisionKind>;

export const BUILD_SLOTS = {
  optionalDevices: 3,
  consumables: 3,
  directives: 1
} as const;

export const LOADOUT_DEFAULTS = {
  preset: 'top'
} as const;

export const POPULAR_SOURCE = {
  windowDays: 90,
  maxBattles: 5000,
  maxBuilds: 500
} as const;

export const GAME_DATA_KIND = {
  progressionTree: 'postProgressionTree',
  modificationPair: 'fieldModificationPair'
} as const;
