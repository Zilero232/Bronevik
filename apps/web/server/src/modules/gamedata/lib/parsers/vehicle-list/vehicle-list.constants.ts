export const VEHICLE_CLASSES = ['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG'] as const;

export const VEHICLE_TAG = {
  collector: 'collectorVehicle',
  wheeled: 'wheeledVehicle',
  secret: 'secret',
  rolePrefix: 'role_'
} as const;

export const EXCLUDED_VEHICLE_TAGS = [
  'observer',
  'maps_training',
  'battle_royale',
  'event_battles',
  'bob',
  'fallout',
  'wt_bot',
  'spawned',
  'epic_battles',
  'comp7',
  'testTank',
  'premiumIGR'
] as const;

export const EXCLUDED_VEHICLE_NAME = /_test$/i;
