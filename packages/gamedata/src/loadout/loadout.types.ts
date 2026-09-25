import type {
  Chassis,
  CrewRoleName,
  CrewSkill,
  Engine,
  Equipment,
  FieldModification,
  FuelTank,
  Gun,
  OptionalDevice,
  Radio,
  Shot,
  Turret,
  VehicleSpec
} from '../model';
import type { Modifier } from '../modifiers';

export type ModulePreset = 'stock' | 'top';

export type ModuleSelection = {
  chassis?: string;
  turret?: string;
  gun?: string;
  engine?: string;
  radio?: string;
  fuelTank?: string;
};

export type ResolvedModules = {
  chassis: Chassis;
  turret: Turret;
  gun: Gun;
  engine: Engine;
  radio: Radio;
  fuelTank?: FuelTank;
};

export type InstalledDevice = {
  device: OptionalDevice;
  specialized?: boolean;
};

export type CrewSkillSelection = {
  skill: CrewSkill;
  level?: number;
};

export type LoadoutCrew = {
  level?: number;
  skills?: CrewSkillSelection[];
  catalog?: CrewSkill[];
};

export type LoadoutState = {
  still?: boolean;
  consumablesActive?: boolean;
};

export type LoadoutInput = {
  vehicle: VehicleSpec;
  modules?: ModulePreset | ModuleSelection;
  optionalDevices?: InstalledDevice[];
  consumables?: Equipment[];
  directives?: Equipment[];
  crew?: LoadoutCrew;
  fieldModifications?: FieldModification[];
  state?: LoadoutState;
};

export type ShellStats = Pick<Shot, 'caliber' | 'defaultPortion' | 'explosionRadius' | 'isPremium' | 'kind' | 'shell' | 'speed'> & {
  damage: number;
  penetration100m: number;
  penetration500m: number;
  damagePerMinute: number;
};

export type CrewSummary = {
  crewLevelIncrease: number;
  levels: Record<CrewRoleName, number>;
  factors: Record<CrewRoleName, number>;
  skillLevels: Record<string, number>;
};

export type FinalStats = {
  modules: Record<keyof ModuleSelection, string | undefined>;
  moduleIds: number[];
  maxHealth: number;
  weight: number;
  enginePower: number;
  powerToWeight: number;
  speedForward: number;
  speedBackward: number;
  hullTraverse: number;
  turretTraverse: number;
  viewRange: number;
  viewRangeUncapped: number;
  radioRange: number;
  reloadTime: number;
  rateOfFire: number;
  clip?: { count: number; interval: number; reloadTime: number };
  autoreloadTimes?: number[];
  dualGunReloadTimes?: number[];
  aimingTime: number;
  dispersion: number;
  dispersionMovement: number;
  dispersionHullRotation: number;
  dispersionTurretRotation: number;
  dispersionAfterShot: number;
  elevation?: number;
  depression?: number;
  shells: ShellStats[];
  crew: CrewSummary;
  staticAttributes: Record<string, number>;
  factors: Record<string, number>;
  terrainResistance: [number, number, number];
};

export type ApplyDevicesInput = {
  vehicle: VehicleSpec;
  devices: InstalledDevice[];
  misc: Record<string, number>;
  physics: Record<string, number>;
};

export type ApplyDynamicInput = {
  vehicle: VehicleSpec;
  input: LoadoutInput;
  misc: Record<string, number>;
  factors: Record<string, number>;
};

export type ComputeCrewInput = {
  vehicle: VehicleSpec;
  crew: LoadoutCrew;
  directives: Equipment[];
  crewLevelIncrease: number;
};

export type SkillFactorInput = {
  crew: CrewSummary;
  definitions: CrewSkill[];
  skill: string;
  params: readonly string[];
};

export type BoostedLevelInput = {
  learned: number | undefined;
  increase: number;
  multiplier?: number;
};

export type ResolveModulesInput = {
  vehicle: VehicleSpec;
  modules?: ModulePreset | ModuleSelection;
};

export type PickModuleInput<T extends { name: string; tier?: number }> = {
  items: T[];
  name?: string;
  preset: ModulePreset;
};

export type ConditionHoldsInput = {
  modifier: Modifier;
  vehicle: VehicleSpec;
};

export type RateOfFireInput = {
  reload: number;
  clip?: { count: number; interval: number };
  autoreload?: number[];
  dualGun?: number[];
};
