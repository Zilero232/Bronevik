import type { MockBattleMode, MockGarageTank } from '../../lesta-mock.types';
import type { DayPlanInput, PlannedBattle } from './simulation.types';

import { MOCK_ACTIVITY, MOCK_OTHER_MODES, MOCK_SALT } from '../../config';
import { createRng, unitFloat } from '../random';
import { dayOf, dayStart, isWeekend, weekdayOf } from '../time';

const HOUR = 3600;

const OTHER_MODES: readonly MockBattleMode[] = MOCK_OTHER_MODES.modes;

const focusOf = (input: DayPlanInput, available: readonly MockGarageTank[]): MockGarageTank | undefined => {
  if (available.length === 0) {
    return undefined;
  }

  const week = Math.floor(input.day / 7);

  return createRng(input.world.seed, MOCK_SALT.week, input.player.index, week).weighted(available, (tank) => tank.weight);
};

const isOnBreak = ({ world, player, day }: DayPlanInput): boolean =>
  player.activity !== 'lapsed' && unitFloat(world.seed, MOCK_SALT.week, player.index, Math.floor(day / 7), 1) < MOCK_ACTIVITY.breakChance;

export const playsOn = (input: DayPlanInput): boolean => {
  const { world, player, day } = input;

  if (day < dayOf(player.createdAt)) {
    return false;
  }

  const chance = player.dayChance * (MOCK_ACTIVITY.weekday[weekdayOf(day)] ?? 1) * (isOnBreak(input) ? MOCK_ACTIVITY.breakFactor : 1);

  return unitFloat(world.seed, MOCK_SALT.day, player.index, day) < chance;
};

export const dayPlan = (input: DayPlanInput): PlannedBattle[] => {
  const { world, player, garage, day } = input;

  if (!playsOn(input)) {
    return [];
  }

  const available = garage.tanks.filter((tank) => tank.availableFromDay <= day && tank.weight > 0);

  if (available.length === 0) {
    return [];
  }

  const rng = createRng(world.seed, MOCK_SALT.day, player.index, day, 1);
  const weekend = isWeekend(day);
  const count = Math.min(
    MOCK_ACTIVITY.maxSessionBattles,
    Math.max(1, Math.round(rng.logNormal(player.sessionBattles * (weekend ? MOCK_ACTIVITY.weekendSession : 1), MOCK_ACTIVITY.sessionSigma)))
  );

  const hour = weekend
    ? rng.normal((player.sessionHour + MOCK_ACTIVITY.weekendHourMean) / 2, MOCK_ACTIVITY.weekendHourSigma)
    : rng.normal(player.sessionHour, MOCK_ACTIVITY.sessionHourJitter);

  const startHour = Math.min(MOCK_ACTIVITY.latestHour, Math.max(MOCK_ACTIVITY.earliestHour, hour));
  const focus = focusOf(input, available);
  const rotationSize = rng.int(MOCK_ACTIVITY.rotationSize[0], Math.min(MOCK_ACTIVITY.rotationSize[1], available.length));
  const rotation: MockGarageTank[] = focus ? [focus] : [];

  while (rotation.length < rotationSize) {
    const candidate = rng.weighted(available, (tank) => (rotation.includes(tank) ? 0 : tank.weight));

    if (rotation.includes(candidate)) {
      break;
    }

    rotation.push(candidate);
  }

  const plan: PlannedBattle[] = [];
  let clock = Math.round(dayStart(day) + startHour * HOUR);

  for (let sequence = 0; sequence < count; sequence += 1) {
    if (sequence > 0 && sequence % MOCK_ACTIVITY.pauseEvery === 0) {
      clock += rng.int(MOCK_ACTIVITY.pauseSec[0], MOCK_ACTIVITY.pauseSec[1]);
    }

    const tank = rng.weighted(rotation, (entry) => entry.weight * (entry === focus ? MOCK_ACTIVITY.focusBoost : 1));
    const interval = rng.int(MOCK_ACTIVITY.battleIntervalSec[0], MOCK_ACTIVITY.battleIntervalSec[1]);
    const durationSec = Math.max(150, interval - rng.int(35, 120));
    const mode: MockBattleMode = rng.chance(tank.otherShare)
      ? rng.weighted(OTHER_MODES, (entry) => MOCK_OTHER_MODES.weights[OTHER_MODES.indexOf(entry)] ?? 0)
      : 'random';

    clock += interval;
    plan.push({ endedAt: clock, durationSec, tankId: tank.vehicle.tankId, mode, sequence, day });
  }

  return plan;
};
