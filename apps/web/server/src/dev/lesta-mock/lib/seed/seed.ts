import { sortBy, unique } from 'remeda';

import type { MockPlayer } from '../../lesta-mock.types';
import type { ClansOfInput, SeedSelection, SeedSelectionInput, SeedStepsInput } from './seed.types';

import { MOCK_TIME } from '../../config';
import { createRng } from '../random';
import { dayOf, dayStart } from '../time';
import { stintAt } from '../world';
import { SEED } from './seed.constants';

export const selectSeedAccounts = ({ world, count, modPlayers }: SeedSelectionInput): SeedSelection => {
  const rng = createRng(world.seed, SEED.salt);
  const regular = world.players.filter((player) => player.activity === 'regular');
  const topCount = Math.round(count * SEED.topShare);
  const top = sortBy(regular, [(player) => player.skill, 'desc']).slice(0, topCount);
  const taken = new Set(top.map((player) => player.index));
  const pool = rng.shuffle(world.players.filter((player) => !taken.has(player.index)));
  const lapsed = pool.filter((player) => player.activity === 'lapsed').slice(0, Math.round(count * SEED.lapsedShare));
  const rest = pool.filter((player) => player.activity !== 'lapsed').slice(0, Math.max(0, count - top.length - lapsed.length));
  const accounts: MockPlayer[] = [...top, ...rest, ...lapsed];
  const mod = sortBy(
    accounts.filter((player) => player.activity === 'regular'),
    [(player) => player.dayChance * player.sessionBattles, 'desc']
  ).slice(0, modPlayers);

  return { accounts, active: top, mod };
};

export const seedSteps = ({ now, days }: SeedStepsInput): number[] => {
  const today = dayOf(now);
  const steps: number[] = [];

  for (let day = today - days; day < today - SEED.fineDays; day += 1) {
    steps.push(dayStart(day + 1) + SEED.dailyHour * 3600);
  }

  for (let at = dayStart(today - SEED.fineDays) + SEED.fineStepSec; at < now; at += SEED.fineStepSec) {
    steps.push(at);
  }

  steps.push(now);

  return unique(steps.filter((at) => at <= now && at > now - (days + 1) * MOCK_TIME.daySec)).sort((left, right) => left - right);
};

export const clansOf = ({ world, accounts, at }: ClansOfInput): number[] =>
  unique(
    accounts
      .flatMap((player) => player.stints.map((stint) => stint.clanId))
      .concat(accounts.flatMap((player) => stintAt({ player, at })?.clanId ?? []))
  ).filter((clanId) => world.clanById.has(clanId));
