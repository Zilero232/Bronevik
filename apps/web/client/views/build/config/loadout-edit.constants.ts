import { LOADOUT } from '@otmetki/schemas';

import type { BuildModuleSlot } from '../lib/build-catalog';
import type { LoadoutSlotField } from '../lib/loadout-edit';

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
