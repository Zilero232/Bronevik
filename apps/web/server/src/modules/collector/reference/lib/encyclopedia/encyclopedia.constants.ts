export const PROVISION_TYPES = {
  equipment: 'equipment',
  optionalDevice: 'optionalDevice',
  directive: 'directive',
  fieldModification: 'fieldModification'
} as const;

export const MODULE_TYPES = ['vehicleChassis', 'vehicleTurret', 'vehicleGun', 'vehicleEngine', 'vehicleRadio'] as const;

export const SPEC_DIFF = {
  maxDepth: 3
} as const;
