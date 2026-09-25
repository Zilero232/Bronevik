import type { Equipment, FinalStats, ModuleBase, ModulePreset, OptionalDevice, VehicleFilter, VehicleSpec } from '@bronevik/gamedata';

import type { ModuleType, PrismaClient, ProvisionType, VehicleType } from '../../../../../generated';
import type { GameData } from '../game-data';
import type { SourceRevision } from '../source';

export type SpecPrimitive = boolean | number | string | null;

export type SpecChange = {
  path: string;
  before?: SpecPrimitive;
  after?: SpecPrimitive;
};

export type DiffInput = {
  before: unknown;
  after: unknown;
  path?: string;
};

export type CollectChangesInput = DiffInput & {
  path: string;
  changes: SpecChange[];
};

export type ProfileStats = Omit<FinalStats, 'crew' | 'factors' | 'staticAttributes' | 'terrainResistance'>;

export type VehicleSummary = {
  tier: number;
  type: string;
  isPremium: boolean;
  price?: { amount: number; currency: string };
  armor: { hull: number[]; turrets: Record<string, number[]> };
  stock?: ProfileStats;
  top?: ProfileStats;
  guns: Record<
    string,
    { reloadTime: number; aimingTime: number; dispersion: number; shells: Record<string, { damage: number; penetration: number }> }
  >;
  engines: Record<string, number>;
  chassis: Record<string, number>;
  speed: { forward: number; backward: number };
};

export type VehicleRow = {
  tankId: number;
  tag: string;
  name: string;
  shortName: string;
  slug: string;
  nation: string;
  type: VehicleType;
  tier: number;
  isPremium: boolean;
  isCollectible: boolean;
  isWheeled: boolean;
  priceCredit?: number;
  priceGold?: number;
  specs: VehicleSpec;
  crew: VehicleSpec['crew'];
  modulesTree: ModuleTreeNode[];
  nextTanks: NextTank[];
  prevTankIds: number[];
};

export type ModuleTreeNode = {
  moduleId: number;
  type: string;
  name: string;
  tier?: number;
  unlocks: { type: string; name: string; id?: number; xp?: number }[];
};

export type NextTank = {
  tankId: number;
  tag: string;
  xp?: number;
};

export type ProfileRow = {
  tankId: number;
  profileId: string;
  isDefault: boolean;
  moduleIds: number[];
  data: ProfileStats;
};

export type ModuleRow = {
  moduleId: number;
  name: string;
  type: ModuleType;
  nation: string;
  tier: number;
  priceCredit?: number;
  weight?: number;
  tankIds: number[];
  data: Record<string, unknown>;
};

export type ProvisionRow = {
  provisionId: number;
  name: string;
  tag: string;
  type: ProvisionType;
  description?: string;
  image?: string;
  priceCredit?: number;
  priceGold?: number;
  tankIds: number[];
  data: Record<string, unknown>;
};

export type CrewRoleRow = {
  role: string;
  name: string;
  skills: string[];
};

export type CrewSkillRow = {
  skill: string;
  name: string;
  type?: string;
  roles: string[];
  isCommon: boolean;
  data: Record<string, unknown>;
};

export type ArenaRow = {
  arenaId: string;
  name: string;
  slug: string;
  camouflageType?: string;
  sizeMeters: number;
  modes: string[];
  image: string;
  data: Record<string, unknown>;
};

export type EntryRow = {
  kind: string;
  key: string;
  data: unknown;
};

export type ImportPlan = {
  version: string;
  title: string;
  revision: SourceRevision;
  vehicles: VehicleRow[];
  profiles: ProfileRow[];
  modules: ModuleRow[];
  provisions: ProvisionRow[];
  crewRoles: CrewRoleRow[];
  crewSkills: CrewSkillRow[];
  arenas: ArenaRow[];
  entries: EntryRow[];
  summaries: Map<number, VehicleSummary>;
  warnings: string[];
};

export type CreateImportPlanInput = {
  data: GameData;
};

export type SummarizeVehicleInput = {
  vehicle: VehicleSpec;
  stock?: FinalStats;
  top?: FinalStats;
};

type ImportMode = 'full' | 'snapshot';

export type WriteImportPlanInput = {
  prisma: PrismaClient;
  plan: ImportPlan;
  mode: ImportMode;
  markCurrent: boolean;
  onProgress?: (message: string) => void;
};

export type ImportCounts = {
  gameVersionId: number;
  vehicles: number;
  profiles: number;
  modules: number;
  provisions: number;
  crewRoles: number;
  crewSkills: number;
  arenas: number;
  entries: number;
  specHistory: number;
  changedVehicles: number;
};

type ModuleKind = 'chassis' | 'engine' | 'gun' | 'radio' | 'turret';

export type VehicleModule = {
  kind: ModuleKind;
  module: ModuleBase;
};

export type PriceColumns = {
  priceCredit?: number;
  priceGold?: number;
};

export type CompatibleTanksInput = {
  filter: VehicleFilter;
  vehicles: VehicleSpec[];
};

export type TryLoadoutInput = {
  vehicle: VehicleSpec;
  preset: ModulePreset;
  warnings: string[];
};

export type DeviceRowInput = {
  device: OptionalDevice;
  vehicles: VehicleSpec[];
};

export type EquipmentRowInput = {
  item: Equipment;
  vehicles: VehicleSpec[];
};

export type InBatchesInput<T> = {
  items: T[];
  size?: number;
  run: (batch: T[]) => Promise<unknown>;
};

export type PlanWriteInput = {
  prisma: PrismaClient;
  plan: ImportPlan;
  gameVersionId: number;
};

export type CatalogCounts = Omit<ImportCounts, 'changedVehicles' | 'entries' | 'gameVersionId' | 'specHistory'>;

export type SpecHistoryCounts = Pick<ImportCounts, 'changedVehicles' | 'specHistory'>;
