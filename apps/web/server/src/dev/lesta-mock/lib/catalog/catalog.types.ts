import type { VehicleType } from '@otmetki/schemas';

import type { CrewRole } from '../../../../../generated';
import type { MockExpected } from '../../lesta-mock.types';

export type CatalogVehicleRow = {
  tank_id: number;
  name: string;
  short_name: string;
  tag: string | null;
  nation: string;
  type: string;
  tier: number;
  is_premium: boolean;
  is_collectible: boolean;
  is_gift: boolean;
  is_wheeled: boolean;
  price_credit: number | null;
  price_gold: number | null;
  description: string | null;
  prev_tank_ids: number[];
  crew: unknown;
  hull_hp: number | null;
  turret_hp: number | null;
  shots: unknown;
  max_ammo: number | null;
  modules_tree: unknown;
};

export type ExpectedRow = {
  tank_id: number;
  exp_damage: number;
  exp_frags: number;
  exp_spotted: number;
  exp_defense: number;
  exp_win_rate: number;
};

export type ShellPriceRow = {
  shell_id: number | null;
  amount: number | null;
  currency: string | null;
};

export type CatalogProvisionRow = {
  provision_id: number;
  name: string;
  tag: string | null;
  type: string;
  description: string | null;
  price_credit: number | null;
  price_gold: number | null;
  weight: number | null;
  tank_ids: number[];
};

export type CatalogModuleRow = {
  module_id: number;
  name: string;
  type: string;
  nation: string;
  tier: number;
  price_credit: number | null;
  weight: number | null;
  tank_ids: number[];
};

export type CatalogArenaRow = {
  arena_id: string;
  name: string;
  description: string | null;
  camouflage_type: string | null;
  modes: string[];
};

export type CatalogCrewSkillRow = {
  skill: string;
  name: string;
  type: string | null;
  roles: string[];
  is_common: boolean;
  description: string | null;
};

export type CatalogCrewRoleRow = Pick<CrewRole, 'name' | 'role' | 'skills'>;

export type GameVersionRow = {
  version: string;
  detected_at: Date;
};

export type CatalogRows = {
  gameVersion: string;
  tanksUpdatedAt: number;
  vehicles: CatalogVehicleRow[];
  expected: ExpectedRow[];
  shellPrices: ShellPriceRow[];
  provisions: CatalogProvisionRow[];
  modules: CatalogModuleRow[];
  arenas: CatalogArenaRow[];
  crewSkills: CatalogCrewSkillRow[];
  crewRoles: CatalogCrewRoleRow[];
};

export type CatalogQueryClient = {
  $queryRawUnsafe: <T>(query: string) => PromiseLike<T>;
};

export type KnownExpected = {
  tier: number;
  type: VehicleType;
  expected: MockExpected;
};

export type FallbackExpectedInput = {
  known: readonly KnownExpected[];
  vehicle: KnownExpected;
};

export type OfInput = {
  key: keyof MockExpected;
  fallback: number;
};

export type HitPointsInput = {
  row: CatalogVehicleRow;
  type: VehicleType;
};
