import type { AccountModeTotals, AccountModeTotalsInput, MockTankModeKey, TankModeOfInput } from './mode-blocks.types';

import { MOCK_MODE_BLOCKS, MOCK_SALT } from '../../config';
import { unitFloat } from '../random';
import { emptyTotals, mergeTotals } from '../stats';

export const tankModeOf = ({ seed, accountId, tank }: TankModeOfInput): MockTankModeKey => {
  const roll = unitFloat(seed, MOCK_SALT.modes, accountId, tank.vehicle.tankId);
  let cumulative = 0;

  for (const [index, key] of MOCK_MODE_BLOCKS.tank.entries()) {
    cumulative += MOCK_MODE_BLOCKS.weights[index] ?? 0;

    if (roll < cumulative) {
      return key;
    }
  }

  return MOCK_MODE_BLOCKS.tank[0];
};

export const accountModeTotals = ({ seed, accountId, tanks }: AccountModeTotalsInput): AccountModeTotals => {
  const totals: AccountModeTotals = {
    stronghold_skirmish: emptyTotals(),
    stronghold_defense: emptyTotals(),
    globalmap_absolute: emptyTotals(),
    epic: emptyTotals(),
    ranked_battles: emptyTotals()
  };

  for (const tank of tanks) {
    mergeTotals({ target: totals[MOCK_MODE_BLOCKS.accountOf[tankModeOf({ seed, accountId, tank })]], source: tank.other });
  }

  return totals;
};
