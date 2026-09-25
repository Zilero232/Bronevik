import type { Modifier } from '../modifiers';
import type { Price } from './common.types';

export type VehicleFilterRule = {
  minLevel?: number;
  maxLevel?: number;
  tags: string[];
  mandatoryTags: string[];
  nations: string[];
};

export type VehicleFilter = {
  include: VehicleFilterRule[];
  exclude: VehicleFilterRule[];
};

export type EquipmentKind = 'ability' | 'consumable' | 'directive' | 'other';

export type SkillBoost = {
  skill: string;
  perkLevelMultiplier?: number;
  efficiencyFactor?: number;
};

export type Equipment = {
  name: string;
  id: number;
  provisionId: number;
  nameKey?: string;
  displayName: string;
  descriptionKey?: string;
  icon?: string;
  kind: EquipmentKind;
  equipmentType: string;
  script?: string;
  tags: string[];
  incompatibleTags: string[];
  price?: Price;
  notInShop: boolean;
  vehicleFilter: VehicleFilter;
  modifiers: Modifier[];
  skillBoost?: SkillBoost;
  params: Record<string, boolean | number | string>;
};

export type OptionalDeviceKind = 'deluxe' | 'modernized' | 'standard' | 'trophy';

export type OptionalDevice = {
  name: string;
  id: number;
  provisionId: number;
  nameKey?: string;
  displayName: string;
  descriptionKey?: string;
  icon?: string;
  kind: OptionalDeviceKind;
  script?: string;
  archetype?: string;
  groupName?: string;
  tags: string[];
  categories: string[];
  incompatibleTags: string[];
  price?: Price;
  removable: boolean;
  vehicleFilter: VehicleFilter;
  modifiers: Modifier[];
  params: Record<string, number[]>;
  upgradedDevice?: string;
};
