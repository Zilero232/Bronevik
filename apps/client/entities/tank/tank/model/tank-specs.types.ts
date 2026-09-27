export type TankSpecGroup = 'firepower' | 'mobility' | 'scouting' | 'survivability';

export type TankSpecUnit = 'deg_s' | 'deg' | 'hp_t' | 'hp' | 'kmh' | 'm' | 'mm' | 'none' | 'per_min' | 's' | 't';

export type TankSpecMeta = {
  group: TankSpecGroup;
  unit: TankSpecUnit;
  digits: number;
  lowerIsBetter?: boolean;
};
