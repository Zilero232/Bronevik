import { LRUCache } from 'lru-cache';

import type { MockBattle, MockGarageTank, MockPlayer, MockPlayerState, MockTankState, MockWorld } from '../../lesta-mock.types';
import type { AdvanceInput, BattlesBetweenInput } from './simulation.types';

import { MOCK_CACHE, MOCK_MOE, MOCK_SALT, MOCK_TIME } from '../../config';
import { buildGarage } from '../garage';
import { createRng, unitFloat } from '../random';
import { addBattle, cloneTotals, emptyTotals } from '../stats';
import { dayOf } from '../time';
import { aggregateBattles, baseOddsFor, combinedExpected, marksFor, moeAlpha, moePercent, oddsFor, simulateBattle } from './battle';
import { dayPlan } from './schedule';

type Checkpoint = {
  day: number;
  state: MockPlayerState;
};

const checkpoints = new LRUCache<string, Checkpoint>({ max: MOCK_CACHE.states });

const cloneState = (state: MockPlayerState): MockPlayerState => ({
  at: state.at,
  lastBattle: state.lastBattle,
  tanks: new Map(
    [...state.tanks].map(([tankId, tank]) => [tankId, { ...tank, random: cloneTotals(tank.random), other: cloneTotals(tank.other) }] as const)
  )
});

const baseTankState = (world: MockWorld, player: MockPlayer, tank: MockGarageTank): MockTankState => {
  const rng = createRng(world.seed, MOCK_SALT.base, player.index, tank.vehicle.tankId);
  const odds = baseOddsFor(player, tank.vehicle, tank.affinity, tank.baseBattles);
  const random = aggregateBattles({ rng, vehicle: tank.vehicle, battles: tank.baseBattles, ...odds });
  const otherBattles = Math.round(tank.baseBattles * tank.otherShare);
  const other = aggregateBattles({ rng, vehicle: tank.vehicle, battles: otherBattles, ...odds, winChance: Math.min(0.8, odds.winChance + 0.03) });
  const ramp = 1 - (1 - moeAlpha()) ** tank.baseBattles;
  const ema = combinedExpected(tank.vehicle) * odds.perf * ramp;
  const recency = tank.weight > 0 ? Math.round(rng.float() ** 3 * 600) : rng.int(30, 2000);

  return {
    vehicle: tank.vehicle,
    random,
    other,
    lastBattle: Math.max(player.createdAt + MOCK_TIME.daySec, player.lastBattleBeforeAnchor - recency * MOCK_TIME.daySec),
    moeEma: ema,
    bestMoePercent: moePercent({ vehicle: tank.vehicle, ema: tank.baseBattles >= 30 ? ema * MOCK_MOE.lucky : ema })
  };
};

export const baseState = (world: MockWorld, player: MockPlayer): MockPlayerState => {
  const garage = buildGarage(world, player);
  const tanks = new Map<number, MockTankState>();

  for (const tank of garage.tanks) {
    if (tank.baseBattles > 0) {
      tanks.set(tank.vehicle.tankId, baseTankState(world, player, tank));
    }
  }

  const lastBattle = Math.max(0, ...[...tanks.values()].map((tank) => tank.lastBattle));

  return { at: world.anchor, lastBattle, tanks };
};

export const advanceState = ({ world, player, garage, state, fromDay, toDay, after, until, onBattle }: AdvanceInput): MockPlayerState => {
  for (let day = fromDay; day <= toDay; day += 1) {
    for (const planned of dayPlan({ world, player, garage, day })) {
      if (planned.endedAt <= after || planned.endedAt > until) {
        continue;
      }

      const tank = garage.byTankId.get(planned.tankId);

      if (!tank) {
        continue;
      }

      const current = state.tanks.get(planned.tankId) ?? {
        vehicle: tank.vehicle,
        random: emptyTotals(),
        other: emptyTotals(),
        lastBattle: 0,
        moeEma: 0,
        bestMoePercent: 0
      };

      const odds = oddsFor(player, tank.vehicle, tank.affinity, current.random.battles + current.other.battles, planned.endedAt);
      const rng = createRng(world.seed, MOCK_SALT.battle, player.index, day, planned.sequence);
      const premiumAccount = unitFloat(world.seed, MOCK_SALT.economy, player.index, day) < player.premiumShare;
      const simulated = simulateBattle({
        rng,
        vehicle: tank.vehicle,
        ...odds,
        endedAt: planned.endedAt,
        durationSec: planned.durationSec,
        mode: planned.mode,
        premiumAccount
      });

      const isRandom = planned.mode === 'random';

      if (isRandom) {
        const combined = simulated.damageDealt + Math.max(simulated.assistedRadio, simulated.assistedTrack, simulated.stunAssisted);

        current.moeEma += moeAlpha() * (combined - current.moeEma);
        current.bestMoePercent = Math.max(current.bestMoePercent, moePercent({ vehicle: tank.vehicle, ema: current.moeEma }));
      }

      const battle: MockBattle = {
        ...simulated,
        moeEma: Math.round(current.moeEma),
        moePercent: moePercent({ vehicle: tank.vehicle, ema: current.moeEma }),
        marksOnGun: marksFor(current.bestMoePercent)
      };

      addBattle(isRandom ? current.random : current.other, battle);
      current.lastBattle = Math.max(current.lastBattle, planned.endedAt);
      state.tanks.set(planned.tankId, current);
      state.lastBattle = Math.max(state.lastBattle, planned.endedAt);
      onBattle?.(battle);
    }
  }

  return state;
};

const checkpointFor = (world: MockWorld, player: MockPlayer, day: number): Checkpoint => {
  const key = `${world.seed}:${player.index}`;
  const cached = checkpoints.get(key);
  const garage = buildGarage(world, player);

  if (cached && cached.day === day) {
    return cached;
  }

  const start =
    cached && cached.day < day ? { day: cached.day, state: cloneState(cached.state) } : { day: world.anchorDay - 1, state: baseState(world, player) };

  const state = advanceState({ world, player, garage, state: start.state, fromDay: start.day + 1, toDay: day, after: -Infinity, until: Infinity });
  const checkpoint = { day, state };

  checkpoints.set(key, checkpoint);

  return checkpoint;
};

export const playerStateAt = (world: MockWorld, player: MockPlayer, at: number): MockPlayerState => {
  const day = dayOf(at);

  if (day < world.anchorDay) {
    return { ...baseState(world, player), at };
  }

  const checkpoint = checkpointFor(world, player, Math.max(world.anchorDay - 1, day - 2));
  const state = cloneState(checkpoint.state);

  advanceState({ world, player, garage: buildGarage(world, player), state, fromDay: checkpoint.day + 1, toDay: day, after: -Infinity, until: at });
  state.at = at;

  return state;
};

export const battlesBetween = ({ world, player, from, to }: BattlesBetweenInput): MockBattle[] => {
  const state = playerStateAt(world, player, from);
  const battles: MockBattle[] = [];

  advanceState({
    world,
    player,
    garage: buildGarage(world, player),
    state,
    fromDay: dayOf(from) - 1,
    toDay: dayOf(to),
    after: from,
    until: to,
    onBattle: (battle) => battles.push(battle)
  });

  return battles;
};

export const tankMarks = (tank: MockTankState): number => marksFor(tank.bestMoePercent);
