import type { FinalStats, InstalledDevice } from '@bronevik/gamedata';
import type { LoadoutResult, ShellStats, VehicleStats } from '@bronevik/schemas';

import { calculateLoadout } from '@bronevik/gamedata';
import { loadoutRequestSchema } from '@bronevik/schemas';
import { isNonNullish, pickBy, unique } from 'remeda';

import { findMockVehicle } from '@/shared/mocks';

import type { MockLoadoutInput, MockPickInput } from './mock.types';

import { crewSkill, equipment, fieldModification, MOCK_PROVISIONS, MOCK_SKILLS, optionalDevice } from './mock-catalog';
import { mockVehicleSpec } from './mock-vehicle';

const toShell = (shell: FinalStats['shells'][number]): ShellStats => ({
  shell: shell.shell,
  kind: shell.kind ?? null,
  caliber: shell.caliber ?? null,
  isPremium: shell.isPremium ?? false,
  damage: Math.round(shell.damage),
  penetration100m: shell.penetration100m,
  penetration500m: shell.penetration500m,
  speed: shell.speed,
  explosionRadius: shell.explosionRadius ?? null,
  damagePerMinute: shell.damagePerMinute
});

const toVehicleStats = (stats: FinalStats): VehicleStats => {
  const shells = stats.shells.map(toShell);

  return {
    modules: pickBy(stats.modules, isNonNullish),
    maxHealth: stats.maxHealth,
    weight: stats.weight,
    enginePower: stats.enginePower,
    powerToWeight: stats.powerToWeight,
    speedForward: stats.speedForward,
    speedBackward: stats.speedBackward,
    hullTraverse: stats.hullTraverse,
    turretTraverse: stats.turretTraverse,
    viewRange: stats.viewRange,
    radioRange: stats.radioRange,
    reloadTime: stats.reloadTime,
    rateOfFire: stats.rateOfFire,
    aimingTime: stats.aimingTime,
    dispersion: stats.dispersion,
    dispersionMovement: stats.dispersionMovement,
    dispersionHullRotation: stats.dispersionHullRotation,
    dispersionTurretRotation: stats.dispersionTurretRotation,
    elevation: stats.elevation ?? null,
    depression: stats.depression ?? null,
    clip: stats.clip ?? null,
    shell: shells[0] ?? null,
    shells
  };
};

export const mockLoadout = ({ tankId, request }: MockLoadoutInput): LoadoutResult | null => {
  const tank = findMockVehicle(tankId);

  if (!tank) {
    return null;
  }

  const { loadout, modules, specialized, crewLevel, state } = loadoutRequestSchema.parse(request);
  const ignored: string[] = [];
  const byId = new Map(MOCK_PROVISIONS.map((seed) => [seed.id, seed]));
  const byTag = new Map(MOCK_PROVISIONS.map((seed) => [seed.tag, seed]));
  const skills = new Map(MOCK_SKILLS.map((seed) => [seed.skill, seed]));

  const pick = ({ ids, kind }: MockPickInput) =>
    ids.filter(isNonNullish).flatMap((id) => {
      const seed = byId.get(id);

      if (seed?.kind !== kind) {
        ignored.push(`${kind}:${id}`);

        return [];
      }

      return [seed];
    });

  const optionalDevices: InstalledDevice[] = loadout.equipment.flatMap((id, slot) =>
    pick({ ids: [id], kind: 'optionalDevice' }).map((seed) => ({ device: optionalDevice(seed), specialized: specialized[slot] ?? false }))
  );

  const fieldModifications = loadout.fieldModifications.flatMap((tag) => {
    const seed = byTag.get(tag);

    return seed?.kind === 'fieldModification' ? [fieldModification(seed)] : [];
  });

  const learned = unique(Object.values(loadout.crewSkills).flat()).flatMap((name) => {
    const seed = skills.get(name);

    return seed ? [{ skill: crewSkill(seed) }] : [];
  });

  const profileId = loadout.profileId === 'stock' ? 'stock' : 'top';
  const stats = calculateLoadout({
    vehicle: mockVehicleSpec(tank),
    modules: modules ?? profileId,
    optionalDevices,
    consumables: pick({ ids: loadout.consumables, kind: 'consumable' }).map(equipment),
    directives: pick({ ids: loadout.directives, kind: 'directive' }).map(equipment),
    fieldModifications,
    crew: { level: crewLevel, skills: learned, catalog: MOCK_SKILLS.map(crewSkill) },
    state
  });

  return {
    tankId,
    profileId: modules ? 'custom' : profileId,
    stats: toVehicleStats(stats),
    crew: { crewLevelIncrease: stats.crew.crewLevelIncrease, levels: stats.crew.levels },
    ignored
  };
};
