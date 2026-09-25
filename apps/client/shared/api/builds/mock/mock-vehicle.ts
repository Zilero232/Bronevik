import type { Chassis, Engine, Gun, ModuleBase, Radio, Turret, VehicleSpec } from '@bronevik/gamedata';
import type { VehicleProfileId } from '@bronevik/schemas';

import { NATIONS } from '@bronevik/gamedata';

import type { MockTank } from '@/shared/mocks';

import type { MockGunInput, MockModuleInput } from './mock.types';

import { mockVehicleStats } from '../../tanks/tank-detail.mock';
import { MOCK_SLOT_OFFSET as SLOT_OFFSET } from './mock.constants';

const PROFILES: VehicleProfileId[] = ['stock', 'top'];

const moduleBase = ({ tank, slot, isTop }: MockModuleInput): ModuleBase => ({
  name: `${tank.slug}_${slot}_${isTop ? 'top' : 'stock'}`,
  id: tank.id * 100 + SLOT_OFFSET[slot] + (isTop ? 1 : 0),
  moduleId: tank.id * 100 + SLOT_OFFSET[slot] + (isTop ? 1 : 0),
  displayName: `${slot} ${isTop ? 'II' : 'I'}`,
  tier: isTop ? tank.tier : Math.max(tank.tier - 1, 1),
  weight: 1_000 + tank.tier * 300,
  tags: [],
  unlocks: []
});

const gunOf = ({ module: input, stats }: MockGunInput): Gun => ({
  ...moduleBase(input),
  reloadTime: stats.reloadTime,
  aimingTime: stats.aimingTime,
  shotDispersionRadius: stats.dispersion,
  shotDispersionFactors: { turretRotation: stats.dispersionTurretRotation, afterShot: 4, whileGunDamaged: 2 },
  pitchLimits: {
    elevation: stats.elevation ?? 20,
    depression: stats.depression ?? 8,
    elevationMax: stats.elevation ?? 20,
    depressionMax: stats.depression ?? 8,
    minPitch: [],
    maxPitch: []
  },
  shots: stats.shells.map((shell, shellIndex) => ({
    shell: shell.shell,
    shellId: input.tank.id * 10 + shellIndex,
    kind: shell.kind ?? undefined,
    damage: { armor: shell.damage, devices: Math.round(shell.damage / 2) },
    caliber: shell.caliber ?? undefined,
    isPremium: shell.isPremium,
    speed: shell.speed,
    gravity: 9.81,
    maxDistance: 720,
    piercingPower: { at100m: shell.penetration100m, at500m: shell.penetration500m }
  }))
});

const profileModules = (tank: MockTank, profile: VehicleProfileId) => {
  const stats = mockVehicleStats({ tank, profile });
  const isTop = profile === 'top';
  const of = (slot: MockModuleInput['slot']): MockModuleInput => ({ tank, slot, isTop });

  const chassis: Chassis = {
    ...moduleBase(of('chassis')),
    rotationSpeed: stats.hullTraverse,
    rotationIsAroundCenter: false,
    terrainResistance: [1, 1.1, 2],
    shotDispersionFactors: { movement: stats.dispersionMovement, rotation: stats.dispersionHullRotation },
    armor: {}
  };

  const engine: Engine = { ...moduleBase(of('engine')), power: stats.enginePower };
  const radio: Radio = { ...moduleBase(of('radio')), distance: stats.radioRange };
  const gun = gunOf({ module: of('gun'), stats });

  const turret: Omit<Turret, 'guns'> = {
    ...moduleBase(of('turret')),
    rotationSpeed: stats.turretTraverse,
    circularVisionRadius: stats.viewRange,
    maxHealth: Math.round(stats.maxHealth * 0.1),
    armor: {},
    primaryArmor: []
  };

  return { stats, chassis, engine, radio, gun, turret };
};

export const mockVehicleSpec = (tank: MockTank): VehicleSpec => {
  const [stock, top] = PROFILES.map((profile) => profileModules(tank, profile));
  const hullWeight = Math.max(stock.stats.weight, top.stats.weight) * 1_000 * 0.6;

  return {
    tag: tank.slug,
    id: tank.id,
    tankId: tank.id,
    nation: NATIONS.find((nation) => nation === tank.nation) ?? NATIONS[0],
    tier: tank.tier,
    type: tank.type,
    tags: [],
    name: tank.name,
    shortName: tank.name,
    notInShop: false,
    isPremium: tank.isPremium,
    isCollectible: false,
    isWheeled: false,
    isSecret: false,
    isClone: false,
    crew: [
      { role: 'commander', extraRoles: ['radioman'] },
      { role: 'gunner', extraRoles: [] },
      { role: 'driver', extraRoles: [] },
      { role: 'loader', extraRoles: [] }
    ],
    speedLimits: { forward: top.stats.speedForward, backward: top.stats.speedBackward },
    invisibility: { moving: 0.1, still: 0.2 },
    hull: { weight: hullWeight, maxHealth: Math.round(top.stats.maxHealth * 0.9), armor: {}, primaryArmor: [] },
    chassis: [stock.chassis, top.chassis],
    turrets: [
      { ...stock.turret, guns: [stock.gun] },
      { ...top.turret, guns: [stock.gun, top.gun] }
    ],
    engines: [stock.engine, top.engine],
    fuelTanks: [],
    radios: [stock.radio, top.radio],
    optDevsOverrides: {},
    supplySlots: [],
    hasSiegeMode: false
  };
};
