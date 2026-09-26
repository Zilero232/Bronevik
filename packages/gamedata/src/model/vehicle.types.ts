import type { Nation, Price } from './common.types';

export type VehicleClass = 'AT-SPG' | 'heavyTank' | 'lightTank' | 'mediumTank' | 'SPG';

export type VehicleListEntry = {
  tag: string;
  id: number;
  tankId: number;
  nation: Nation;
  tier: number;
  type: VehicleClass;
  role?: string;
  tags: string[];
  nameKey?: string;
  shortNameKey?: string;
  descriptionKey?: string;
  name: string;
  shortName: string;
  price?: Price;
  notInShop: boolean;
  isPremium: boolean;
  isCollectible: boolean;
  isWheeled: boolean;
  isSecret: boolean;
  isClone: boolean;
};

export type Shell = {
  name: string;
  id: number;
  shellId: number;
  nation: Nation;
  nameKey?: string;
  displayName: string;
  kind: string;
  caliber: number;
  damage: { armor: number; devices: number };
  explosionRadius?: number;
  mechanics?: string;
  icon?: string;
  isPremium: boolean;
  isTracer: boolean;
  price?: Price;
};

export type Unlock = {
  type: string;
  name: string;
  cost?: number;
};

export type ModuleBase = {
  name: string;
  id: number;
  moduleId: number;
  nameKey?: string;
  displayName: string;
  tier?: number;
  price?: Price;
  weight: number;
  maxHealth?: number;
  tags: string[];
  unlocks: Unlock[];
};

export type Shot = {
  shell: string;
  shellId?: number;
  kind?: string;
  damage?: { armor: number; devices: number };
  caliber?: number;
  explosionRadius?: number;
  isPremium?: boolean;
  speed: number;
  gravity: number;
  maxDistance: number;
  piercingPower: { at100m: number; at500m: number };
  defaultPortion?: number;
};

export type PitchPoint = {
  angle: number;
  pitch: number;
};

export type PitchLimits = {
  elevation: number;
  depression: number;
  elevationMax: number;
  depressionMax: number;
  minPitch: PitchPoint[];
  maxPitch: PitchPoint[];
};

export type RateOfFire = {
  count: number;
  rate: number;
  interval: number;
};

export type Gun = ModuleBase & {
  reloadTime: number;
  aimingTime: number;
  shotDispersionRadius: number;
  shotDispersionFactors: { turretRotation: number; afterShot: number; whileGunDamaged: number };
  rotationSpeed?: number;
  maxAmmo?: number;
  pitchLimits?: PitchLimits;
  turretYawLimits?: [number, number];
  invisibilityFactorAtShot?: number;
  clip?: RateOfFire;
  burst?: RateOfFire;
  autoreload?: { reloadTimes: number[]; boostStartTime?: number; boostResidueTime?: number; boostFraction?: number };
  dualGun?: { chargeTime?: number; reloadTimes: number[]; rateTime?: number; reloadLockTime?: number };
  shots: Shot[];
  armor?: Armor;
  spacedArmor?: string[];
  collision?: string;
};

export type Armor = Record<string, number>;

export type Turret = ModuleBase & {
  rotationSpeed: number;
  circularVisionRadius: number;
  armor: Armor;
  primaryArmor: number[];
  yawLimits?: [number, number];
  guns: Gun[];
  spacedArmor?: string[];
  collision?: string;
};

export type Chassis = ModuleBase & {
  rotationSpeed: number;
  rotationIsAroundCenter: boolean;
  terrainResistance: [number, number, number];
  shotDispersionFactors: { movement: number; rotation: number };
  brakeForce?: number;
  maxClimbAngle?: number;
  armor: Armor;
  repairTime?: number;
  spacedArmor?: string[];
  collision?: string;
};

export type Engine = ModuleBase & {
  power: number;
  fireStartingChance?: number;
};

export type Radio = ModuleBase & {
  distance: number;
};

export type FuelTank = ModuleBase;

export type Hull = {
  weight: number;
  maxHealth: number;
  armor: Armor;
  primaryArmor: number[];
  ammoBayHealth?: number;
  spacedArmor?: string[];
  collision?: string;
};

export type CrewMember = {
  role: string;
  extraRoles: string[];
};

export type VehicleSpec = VehicleListEntry & {
  crew: CrewMember[];
  speedLimits: { forward: number; backward: number };
  invisibility: { moving: number; still: number; camouflageBonus?: number; firePenalty?: number };
  hull: Hull;
  chassis: Chassis[];
  turrets: Turret[];
  engines: Engine[];
  fuelTanks: FuelTank[];
  radios: Radio[];
  optDevsOverrides: Record<string, Record<string, number[]>>;
  supplySlots: number[];
  postProgressionTree?: string;
  hasSiegeMode: boolean;
  repairCost?: number;
};
