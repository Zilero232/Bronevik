import type { MockClan } from '../../lesta-mock.types';

import { MOCK_CLANS, MOCK_SALT, MOCK_TIME } from '../../config';
import { unitFloat } from '../random';
import { dayOf } from '../time';

const ELO_TIERS = [6, 8, 10] as const;
const SKIRMISH_RATE = { top: 14, mid: 6, small: 1.2 } as const;
const SKIRMISH_SHARE = { 6: 0.25, 8: 0.35, 10: 1 } as const;
const SKIRMISH_WIN = { top: 0.62, mid: 0.54, small: 0.47 } as const;

export const clanElo = (seed: number, clan: MockClan, at: number) => {
  const days = Math.max(0, dayOf(at) - dayOf(MOCK_TIME.anchor));
  const elo = { ...clan.elo };

  if (!clan.onGlobalMap) {
    return null;
  }

  for (const tier of ELO_TIERS) {
    let value = clan.elo[tier];

    for (let day = 0; day < days; day += 1) {
      const step = (unitFloat(seed, MOCK_SALT.elo, clan.clanId, tier, day) - 0.5) * 2 * MOCK_CLANS.eloDrift;

      value += step + (clan.elo[tier] - value) * 0.02;
    }

    elo[tier] = Math.round(value);
  }

  return elo;
};

export const skirmishStats = (seed: number, clan: MockClan, at: number) => {
  const days = Math.max(1, (at - clan.createdAt) / MOCK_TIME.daySec);
  const rate = SKIRMISH_RATE[clan.tier];

  return Object.fromEntries(
    ELO_TIERS.flatMap((tier) => {
      const total = Math.round(days * rate * SKIRMISH_SHARE[tier] * (0.8 + 0.4 * unitFloat(seed, MOCK_SALT.stronghold, clan.clanId, tier)));
      const win = Math.round(total * (SKIRMISH_WIN[clan.tier] + 0.04 * (unitFloat(seed, MOCK_SALT.stronghold, clan.clanId, tier, 1) - 0.5)));

      return [
        [`total_${tier}`, total],
        [`win_${tier}`, win]
      ];
    })
  );
};
