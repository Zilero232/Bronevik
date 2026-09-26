import type { ARMOR_FLAGS, ARMOR_PIECE_KINDS } from './armor-model.constants';

export type ArmorFlag = keyof typeof ARMOR_FLAGS;

export type ArmorPieceKind = (typeof ARMOR_PIECE_KINDS)[number];

export type Vec3 = [number, number, number];

export type ArmorGroup = {
  plate: string;
  start: number;
  count: number;
};

export type ArmorPieceGeometry = {
  name: string;
  kind: ArmorPieceKind;
  positions: Float32Array;
  indices: Uint32Array;
  groups: ArmorGroup[];
};

export type ArmorMounts = {
  hull: Vec3;
  turret: Vec3;
  guns: Record<string, Vec3>;
  pitch: Record<string, [number, number]>;
};

export type ArmorGeometry = {
  pieces: ArmorPieceGeometry[];
  mounts: ArmorMounts;
};

export type ArmorPlate = {
  name: string;
  thickness: number;
  flags: number;
};

export type ArmorShellOption = {
  name: string;
  displayName: string;
  kind: string;
  caliber: number;
  damage: number;
  penetration: { at100m: number; at500m: number };
  isPremium: boolean;
};

export type ArmorPieceArmor = {
  piece: string;
  plates: ArmorPlate[];
};

export type ArmorGunModule = ArmorPieceArmor & {
  name: string;
  displayName: string;
  shells: ArmorShellOption[];
};

export type ArmorTurretModule = ArmorPieceArmor & {
  name: string;
  displayName: string;
  guns: ArmorGunModule[];
};

export type ArmorChassisModule = ArmorPieceArmor & {
  name: string;
  displayName: string;
};

export type ArmorModules = {
  hull: ArmorPieceArmor;
  chassis: ArmorChassisModule[];
  turrets: ArmorTurretModule[];
};

export type HasArmorFlagInput = {
  flags: number;
  flag: ArmorFlag;
};
