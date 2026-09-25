import type { VehicleClass } from '@bronevik/gamedata';

import type { ModuleType, ProvisionType, VehicleType } from '../../../../../generated';

export const DIFF_KEYS = ['name', 'shell', 'tag'] as const;

export const VEHICLE_TYPE: Record<VehicleClass, VehicleType> = {
  lightTank: 'lightTank',
  mediumTank: 'mediumTank',
  heavyTank: 'heavyTank',
  'AT-SPG': 'atSpg',
  SPG: 'spg'
};

export const MODULE_TYPE = {
  chassis: 'vehicleChassis',
  turret: 'vehicleTurret',
  gun: 'vehicleGun',
  engine: 'vehicleEngine',
  radio: 'vehicleRadio'
} as const satisfies Record<string, ModuleType>;

export const PROVISION_TYPE = {
  optionalDevice: 'optionalDevice',
  consumable: 'equipment',
  directive: 'directive',
  fieldModification: 'fieldModification'
} as const satisfies Record<string, ProvisionType>;

export const PROFILE = {
  stock: 'stock',
  top: 'top'
} as const;

export const ENTRY_KIND = {
  meta: 'meta',
  vehicle: 'vehicle',
  shell: 'shell',
  optionalDevice: 'optionalDevice',
  equipment: 'equipment',
  crewSkill: 'crewSkill',
  crewRole: 'crewRole',
  progressionTree: 'postProgressionTree',
  fieldModification: 'fieldModification',
  modificationPair: 'fieldModificationPair',
  arena: 'arena'
} as const;

export const WRITE = {
  batchSize: 50,
  entryBatchSize: 500
} as const;
