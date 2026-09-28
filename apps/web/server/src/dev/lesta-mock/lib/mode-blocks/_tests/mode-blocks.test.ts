import { describe, expect, it } from 'vitest';

import { MOCK_TIME } from '../../../config';
import { playerStateAt } from '../../simulation';
import { DAY, fixtureWorld } from '../../world/_tests/fixtures';
import { accountModeTotals, tankModeOf } from '../mode-blocks';

const AT = MOCK_TIME.anchor + 120 * DAY;
const player = fixtureWorld.players.find((entry) => entry.activity === 'regular');

describe('accountModeTotals', () => {
  it('puts every non-random battle into exactly one mode block', () => {
    if (!player) {
      throw new Error('no regular player');
    }

    const tanks = [...playerStateAt({ world: fixtureWorld, player, at: AT }).tanks.values()];
    const totals = accountModeTotals({ seed: fixtureWorld.seed, accountId: player.accountId, tanks });

    expect(Object.values(totals).reduce((sum, block) => sum + block.battles, 0)).toBe(tanks.reduce((sum, tank) => sum + tank.other.battles, 0));
  });
});

describe('tankModeOf', () => {
  it('keeps a tank in the same mode on every request', () => {
    if (!player) {
      throw new Error('no regular player');
    }

    const [tank] = playerStateAt({ world: fixtureWorld, player, at: AT }).tanks.values();

    if (!tank) {
      throw new Error('empty garage');
    }

    const input = { seed: fixtureWorld.seed, accountId: player.accountId, tank };

    expect(tankModeOf(input)).toBe(tankModeOf(input));
  });
});
