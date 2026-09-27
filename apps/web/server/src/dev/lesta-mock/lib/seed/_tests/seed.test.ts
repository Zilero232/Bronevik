import { describe, expect, it } from 'vitest';

import { seedSteps, selectSeedAccounts } from '..';
import { MOCK_TIME } from '../../../config';
import { DAY, fixtureWorld } from '../../world/_tests/fixtures';

describe('seed planning', () => {
  it('walks forward in time with daily and then finer steps', () => {
    const now = MOCK_TIME.anchor + 200 * DAY;
    const steps = seedSteps({ now, days: 30 });

    expect(steps.at(-1)).toBe(now);
    expect(steps.every((at, index) => index === 0 || at > (steps[index - 1] ?? 0))).toBe(true);
    expect(steps[0]).toBeGreaterThanOrEqual(now - 31 * DAY);
  });

  it('selects a deterministic mix of strong, random and lapsed players', () => {
    const selection = selectSeedAccounts({ world: fixtureWorld, count: 100, modPlayers: 10 });

    expect(selection.accounts).toHaveLength(100);
    expect(new Set(selection.accounts.map((player) => player.accountId)).size).toBe(100);
    expect(selection.mod).toHaveLength(10);

    expect(selectSeedAccounts({ world: fixtureWorld, count: 100, modPlayers: 10 }).accounts.map((player) => player.index)).toEqual(
      selection.accounts.map((player) => player.index)
    );
  });
});
