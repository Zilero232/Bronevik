import { clamp, range } from 'remeda';

import type { MockShell } from '../../lesta-mock.types';
import type { ArenaWeightInput, BattleExtrasInput, MockShot } from './battle-extras.types';

import { MOCK_SALT } from '../../config';
import { unitFloat } from '../random';
import { hourOf } from '../time';
import { MOCK_ARENA_WEIGHT, MOCK_MEDALS, MOCK_QUEUE, MOCK_SHOTS } from './battle-extras.constants';

const SHELL_KINDS: ReadonlyMap<string, MockShot['shell']> = new Map(Object.entries(MOCK_SHOTS.shells));

export const mockMedals = ({ battle, vehicle, rng }: BattleExtrasInput): string[] => {
  const won = battle.result === 'win';
  const medals = [
    battle.frags >= MOCK_MEDALS.warrior.frags && 'warrior',
    battle.spotted >= MOCK_MEDALS.scout.spotted && 'scout',
    battle.survived &&
      battle.damageBlocked >= MOCK_MEDALS.steelwall.blocked &&
      battle.directHitsReceived >= MOCK_MEDALS.steelwall.hitsReceived &&
      'steelwall',
    battle.survived && battle.capturePoints >= MOCK_MEDALS.invader.capture && 'invader',
    battle.droppedCapturePoints >= MOCK_MEDALS.defender.dropped && 'defender',
    battle.damageDealt >= Math.max(MOCK_MEDALS.mainGun.minDamage, MOCK_MEDALS.mainGun.hpFactor * vehicle.hp) && 'mainGun',
    battle.assistedRadio >= MOCK_MEDALS.evileye.radio && 'evileye',
    vehicle.tier >= MOCK_MEDALS.radleyWalters.minTier && battle.frags >= MOCK_MEDALS.radleyWalters.frags && 'medalRadleyWalters',
    battle.frags >= MOCK_MEDALS.lafayettePool.frags && 'medalLafayettePool',
    won && battle.frags >= MOCK_MEDALS.kolobanov.frags && rng.chance(MOCK_MEDALS.kolobanov.chance) && 'medalKolobanov',
    vehicle.type === 'lightTank' && battle.frags >= MOCK_MEDALS.orlik.frags && rng.chance(MOCK_MEDALS.orlik.chance) && 'medalOrlik',
    battle.survived &&
      battle.frags >= MOCK_MEDALS.billotte.frags &&
      battle.damageReceived >= MOCK_MEDALS.billotte.receivedShare * vehicle.hp &&
      rng.chance(MOCK_MEDALS.billotte.chance) &&
      'medalBillotte',
    won && battle.frags >= MOCK_MEDALS.crucial.frags && rng.chance(MOCK_MEDALS.crucial.chance) && 'medalCrucialContribution'
  ];

  return medals.filter((medal) => typeof medal === 'string');
};

const shellOf = (shell: MockShell): MockShot['shell'] => SHELL_KINDS.get(shell.kind) ?? 'unknown';

export const mockShots = ({ battle, vehicle, rng }: BattleExtrasInput): MockShot[] | null => {
  const standard = vehicle.shells.find((shell) => !shell.isPremium && shell.damage !== null && shell.kind !== 'HIGH_EXPLOSIVE');
  const premium = vehicle.shells.find((shell) => shell.isPremium && shell.damage !== null);
  const main = standard ?? vehicle.shells.find((shell) => shell.damage !== null);

  if (!main?.damage || battle.shots === 0) {
    return null;
  }

  const [nearest, farthest] = MOCK_SHOTS.distance[vehicle.type];
  const total = Math.min(battle.shots, MOCK_SHOTS.maxShots);
  const hits = Math.min(battle.hits, total);
  const pierced = Math.min(battle.piercings, hits);
  const fatal = new Set(rng.shuffle(range(0, pierced)).slice(0, battle.frags));

  return rng.shuffle(
    range(0, total).map((index): MockShot => {
      const shell = index < pierced && premium?.damage && rng.chance(MOCK_SHOTS.premiumPierceShare) ? premium : main;
      const nominal = shell.damage ?? main.damage ?? 1;
      const distance = rng.int(nearest, farthest);

      if (index >= hits) {
        return { damage: 0, nominal, shell: shellOf(shell), outcome: 'miss', distance_m: distance, fatal: false };
      }

      if (index >= pierced) {
        return { damage: 0, nominal, shell: shellOf(shell), outcome: 'no_damage', distance_m: distance, fatal: false };
      }

      const roll = 1 + clamp(rng.normal(0, MOCK_SHOTS.rollDeviation), { min: -MOCK_SHOTS.spread, max: MOCK_SHOTS.spread });
      const damage = Math.round(nominal * roll);
      const isFatal = fatal.has(index);

      return {
        damage: isFatal ? Math.max(1, Math.round(damage * rng.float())) : damage,
        nominal,
        shell: shellOf(shell),
        outcome: 'damage',
        distance_m: distance,
        fatal: isFatal
      };
    })
  );
};

export const mockQueueSec = ({ battle, vehicle, rng }: BattleExtrasInput): number => {
  const hour = Math.floor(hourOf(battle.endedAt - battle.durationSec));
  const base = MOCK_QUEUE.tierBaseSec[vehicle.tier] ?? MOCK_QUEUE.tierBaseSec[0];
  const factor = (MOCK_QUEUE.hourFactor[hour] ?? 1) * MOCK_QUEUE.modeFactor[battle.mode];

  return clamp(Math.round(rng.logNormal(base * factor, MOCK_QUEUE.sigma)), { min: MOCK_QUEUE.minSec, max: MOCK_QUEUE.maxSec });
};

export const mockArenaWeight = ({ seed, index, tier }: ArenaWeightInput): number => {
  const band = MOCK_ARENA_WEIGHT.tierBands.filter((edge) => tier > edge).length;

  return MOCK_ARENA_WEIGHT.floor + unitFloat(seed, MOCK_SALT.arena, index, band);
};
