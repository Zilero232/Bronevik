import type { ModBattleLoadout } from '@otmetki/schemas';

import type { BattleResultEvent } from '../../../../modules/mod';
import type { MockProvision, MockVehicle } from '../../lesta-mock.types';
import type { MockRng } from '../random';
import type { BattleEventInput, LoadoutInput } from './battles.types';

import { MOCK_SALT } from '../../config';
import { createRng, hashSeed } from '../random';
import { damageRatio } from '../skill';
import { dayOf } from '../time';
import { BATTLE_ROWS, BONUS_TYPES, CONSUMABLES, CREW_PRIORITY, ECONOMY, FAMILY_KEYWORDS, LOADOUT_FAMILIES } from './battles.constants';

const FAMILY_KEYWORD_MAP: ReadonlyMap<string, readonly string[]> = new Map(Object.entries(FAMILY_KEYWORDS));

const CREW_PRIORITY_MAP: ReadonlyMap<string, readonly string[]> = new Map(Object.entries(CREW_PRIORITY));

const normalizeTag = (provision: MockProvision): string => (provision.tag ?? provision.name).toLowerCase().replaceAll(/[^a-z0-9]/g, '');

const fits = (provision: MockProvision, vehicle: MockVehicle): boolean => provision.tankIds.includes(vehicle.tankId);

const variantScore = (tag: string, skilled: boolean): number => {
  if (tag.includes('trophyupgraded') || tag.includes('delux') || tag.includes('modernized')) {
    return skilled ? 3 : 0.5;
  }

  if (tag.includes('trophybasic')) {
    return skilled ? 2 : 1;
  }

  return skilled ? 1 : 3;
};

const pickDevices = (rng: MockRng, devices: readonly MockProvision[], vehicle: MockVehicle, skilled: boolean): number[] => {
  const families = [...LOADOUT_FAMILIES[vehicle.type]];

  if (families.length > 3 && rng.chance(0.2)) {
    [families[2], families[3]] = [families[3] ?? families[2] ?? '', families[2] ?? ''];
  }

  const chosen: number[] = [];

  for (const family of families) {
    if (chosen.length >= 3) {
      break;
    }

    const keywords = FAMILY_KEYWORD_MAP.get(family) ?? [family];
    const candidates = devices.filter((device) => keywords.some((keyword) => normalizeTag(device).includes(keyword)));

    if (candidates.length > 0) {
      chosen.push(rng.weighted(candidates, (device) => variantScore(normalizeTag(device), skilled)).provisionId);
    }
  }

  return chosen;
};

const byTag = (provisions: readonly MockProvision[], tag: string): MockProvision | undefined =>
  provisions.find((provision) => (provision.tag ?? '').toLowerCase() === tag.toLowerCase()) ??
  provisions.find((provision) => (provision.tag ?? '').toLowerCase().startsWith(tag.toLowerCase()));

const pickConsumables = (rng: MockRng, equipment: readonly MockProvision[], skilled: boolean): number[] => {
  const wanted = skilled || rng.chance(0.35) ? [...CONSUMABLES.premium, rng.pick(CONSUMABLES.third)] : [...CONSUMABLES.basic];

  return wanted.flatMap((tag) => {
    const provision = byTag(equipment, tag);

    return provision ? [provision.provisionId] : [];
  });
};

const crewOf = (world: LoadoutInput['world'], vehicle: MockVehicle, skills: number): ModBattleLoadout['crew'] => {
  const known = new Set(world.catalog.crewSkills.map((skill) => skill.skill));

  return vehicle.crew.map((member) => {
    const priority = CREW_PRIORITY_MAP.get(member.role) ?? CREW_PRIORITY.commander;

    return { role: member.role, skills: priority.filter((skill) => known.has(skill)).slice(0, skills) };
  });
};

export const buildMockLoadout = ({ world, player, vehicle }: LoadoutInput): ModBattleLoadout => {
  const rng = createRng(world.seed, MOCK_SALT.loadout, player.index, vehicle.tankId);
  const skilled = damageRatio(player) > 1.05;
  const compatible = world.catalog.provisions.filter((provision) => fits(provision, vehicle));
  const devices = compatible.filter((provision) => provision.type === 'optional_device');
  const equipment = compatible.filter((provision) => provision.type === 'equipment');
  const directives = compatible.filter((provision) => provision.type === 'directive');
  const premiumShare = Math.min(0.5, Math.max(0.08, 0.15 + 0.2 * (damageRatio(player) - 0.8)));
  const standard = vehicle.shells.filter((shell) => !shell.isPremium && shell.kind !== 'HIGH_EXPLOSIVE');
  const premium = vehicle.shells.filter((shell) => shell.isPremium);
  const explosive = vehicle.shells.filter((shell) => shell.kind === 'HIGH_EXPLOSIVE' && !shell.isPremium);
  const shells = [
    { shell: standard[0] ?? vehicle.shells[0], share: 1 - premiumShare - (explosive.length > 0 ? 0.12 : 0) },
    { shell: premium[0], share: premiumShare },
    { shell: explosive[0], share: 0.12 }
  ].flatMap(({ shell, share }) => (shell ? [{ shell_id: shell.shellId, count: Math.max(1, Math.round(vehicle.maxAmmo * share)) }] : []));

  const skills = Math.min(6, Math.max(1, Math.round(1 + Math.log2(1 + player.careerBattles / 2000))));

  return {
    optional_devices: pickDevices(rng, devices, vehicle, skilled),
    consumables: pickConsumables(rng, equipment, skilled),
    directives: skilled && directives.length > 0 && rng.chance(0.6) ? [rng.pick(directives).provisionId] : [],
    shells: shells.slice(0, 4),
    field_modifications: [],
    crew: crewOf(world, vehicle, skills),
    gameplay_id: null
  };
};

const shellCost = (vehicle: MockVehicle, loadout: ModBattleLoadout, shots: number): number => {
  const total = loadout.shells.reduce((sum, shell) => sum + shell.count, 0);

  return Math.round(
    loadout.shells.reduce((sum, entry) => {
      const shell = vehicle.shells.find((candidate) => candidate.shellId === entry.shell_id);
      const price = shell ? (shell.currency === 'gold' ? shell.price * ECONOMY.goldToCredits : shell.price) : 0;

      return sum + (total > 0 ? (entry.count / total) * shots * price : 0);
    }, 0)
  );
};

export const toBattleEvent = ({ world, player, battle, platoonMates }: BattleEventInput): BattleResultEvent => {
  const vehicle = world.catalog.vehicleById.get(battle.tankId);

  if (!vehicle) {
    throw new RangeError(`unknown vehicle ${battle.tankId}`);
  }

  const rng = createRng(world.seed, MOCK_SALT.economy, player.index, battle.endedAt);
  const loadout = buildMockLoadout({ world, player, vehicle });
  const won = battle.result === 'win';
  const premiumTank = vehicle.isPremium || vehicle.isCollectible;
  const assist = battle.assistedRadio + battle.assistedTrack + battle.stunAssisted;
  const baseCredits = (ECONOMY.tierBase[vehicle.tier] ?? 0) * (won ? 0.75 : 0.5) + (battle.damageDealt + 0.5 * assist) * ECONOMY.creditsPerDamage;
  const original = Math.round(baseCredits * (premiumTank ? ECONOMY.premiumTank : 1));
  const credits = Math.round(original * (battle.premiumAccount ? ECONOMY.premiumAccount : 1));
  const repair = Math.round(
    (ECONOMY.repairFull[vehicle.tier] ?? 0) *
      (battle.survived ? battle.damageReceived / vehicle.hp : 1) *
      (premiumTank ? ECONOMY.premiumTankRepair : 1)
  );

  const ammo = shellCost(vehicle, loadout, battle.shots);
  const premiumKit = loadout.consumables.length > 0 && loadout.consumables.length < 3;
  const consumables = premiumKit
    ? Math.round(ECONOMY.premiumKitPrice * (battle.survived ? rng.int(0, 2) : rng.int(1, 3)))
    : Math.round(ECONOMY.basicKitPrice * (battle.survived ? rng.int(0, 1) : rng.int(1, 2)));

  const xp = Math.round(battle.xp * (battle.premiumAccount ? ECONOMY.premiumAccount : 1));
  const arenas = world.catalog.arenas.filter((arena) => arena.modes.includes(battle.mode === 'frontline' ? 'epic' : 'ctf'));
  const arena = arenas.length > 0 ? rng.pick(arenas) : undefined;
  const arenaUniqueId = BigInt(battle.endedAt) * 1_000_000n + BigInt(hashSeed(world.seed, player.index, battle.endedAt, battle.tankId) % 1_000_000);
  const bonusType = BONUS_TYPES[battle.mode];
  const withMoe = battle.mode === 'random' && vehicle.tier >= BATTLE_ROWS.moeMinTier;

  return {
    type: 'battle_result',
    event_id: `battle:${arenaUniqueId}`,
    occurred_at: battle.endedAt,
    arena_unique_id: String(arenaUniqueId),
    arena_type_id: hashSeed(world.seed, MOCK_SALT.arena, arena ? arena.arenaId.length : 0) % 65_535,
    map_name: arena?.arenaId ?? null,
    bonus_type: bonusType,
    gui_type: bonusType,
    arena_created_at: battle.endedAt - battle.durationSec,
    duration_s: battle.durationSec,
    finish_reason: 1,
    winner_team: battle.result === 'draw' ? 0 : won ? battle.team : 3 - battle.team,
    team: battle.team,
    result: battle.result,
    vehicle: { tank_id: vehicle.tankId, name: vehicle.name, tier: vehicle.tier },
    stats: {
      damage_dealt: battle.damageDealt,
      damage_assisted_radio: battle.assistedRadio,
      damage_assisted_track: battle.assistedTrack,
      damage_assisted_stun: battle.stunAssisted,
      damage_blocked: battle.damageBlocked,
      spotted: battle.spotted,
      frags: battle.frags,
      damaged: Math.max(battle.frags, Math.min(15, battle.piercings)),
      shots: battle.shots,
      direct_hits: battle.hits,
      direct_enemy_hits: battle.hits,
      piercings: battle.piercings,
      piercing_enemy_hits: battle.piercings,
      xp,
      original_xp: battle.xp,
      credits,
      original_credits: original,
      subtotal_credits: credits - repair,
      factual_credits: credits - repair - ammo - consumables,
      life_time_s: battle.lifetimeSec,
      is_alive: battle.survived,
      death_reason: battle.survived ? -1 : rng.int(0, 3),
      is_premium: battle.premiumAccount,
      free_xp: Math.round(xp * ECONOMY.freeXpShare),
      repair_cost: repair,
      ammo_cost: ammo,
      consumables_cost: consumables
    },
    moe: withMoe ? { marks_on_gun: battle.marksOnGun, damage_rating: Math.round(battle.moePercent * 100), moving_avg_damage: battle.moeEma } : null,
    queue_time_s: rng.int(BATTLE_ROWS.queueSec[0], BATTLE_ROWS.queueSec[1]),
    session_id: battle.mode === 'random' ? `mock-${dayOf(battle.endedAt)}` : null,
    loadout,
    platoon: platoonMates.length > 0 ? { size: platoonMates.length + 1, mates: [...platoonMates] } : { size: 1, mates: [] },
    shots: null
  };
};
