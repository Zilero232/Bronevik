export type VehicleRow = {
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

export type ProvisionRow = {
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

export type ModuleRow = {
  module_id: number;
  name: string;
  type: string;
  nation: string;
  tier: number;
  price_credit: number | null;
  weight: number | null;
  tank_ids: number[];
};

export type ArenaRow = {
  arena_id: string;
  name: string;
  description: string | null;
  camouflage_type: string | null;
  modes: string[];
};

export type CrewSkillRow = {
  skill: string;
  name: string;
  type: string | null;
  roles: string[];
  is_common: boolean;
  description: string | null;
};

export type CrewRoleRow = {
  role: string;
  name: string;
  skills: string[];
};

export type GameVersionRow = {
  version: string;
  detected_at: Date;
};

export type CatalogRows = {
  gameVersion: string;
  tanksUpdatedAt: number;
  vehicles: VehicleRow[];
  expected: ExpectedRow[];
  shellPrices: ShellPriceRow[];
  provisions: ProvisionRow[];
  modules: ModuleRow[];
  arenas: ArenaRow[];
  crewSkills: CrewSkillRow[];
  crewRoles: CrewRoleRow[];
};

export type CatalogQueryClient = {
  $queryRawUnsafe: <T>(query: string) => PromiseLike<T>;
};
