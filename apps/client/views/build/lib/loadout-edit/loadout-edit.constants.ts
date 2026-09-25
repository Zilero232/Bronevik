import { LOADOUT } from '@bronevik/schemas';

import type { BuildModuleSlot } from '../build-catalog';
import type { LoadoutSlotField } from './loadout-edit.types';

export const SLOT_SIZES = {
  equipment: LOADOUT.equipmentSlots,
  consumables: LOADOUT.consumableSlots,
  directives: LOADOUT.directiveSlots
} as const satisfies Record<LoadoutSlotField, number>;

export const MODULE_SLOTS = ['gun', 'turret', 'engine', 'chassis', 'radio'] as const satisfies readonly BuildModuleSlot[];

export const MODULE_ORDER = ['turret', 'gun', 'engine', 'chassis', 'radio'] as const satisfies readonly BuildModuleSlot[];

export const LOADOUT_REQUEST = {
  crewLevel: 100,
  preset: 'top'
} as const;
