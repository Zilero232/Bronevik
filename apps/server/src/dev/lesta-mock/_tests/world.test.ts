import { describe, expect, it } from 'vitest';

import { MOCK_TIME, MOCK_WORLD } from '../config';
import { selectFields } from '../lib/fields';
import { createRng, hashSeed, normalCdf, normalQuantile } from '../lib/random';
import { seedSteps, selectSeedAccounts } from '../lib/seed';
import { clanMembersAt, createMockWorld, stintAt } from '../lib/world';
import { DAY, fixtureCatalog, fixtureWorld } from './fixtures';

describe('random', () => {
  it('derives the same stream from the same parts', () => {
    const left = createRng(1, 2, 3);
    const right = createRng(1, 2, 3);

    expect(Array.from({ length: 5 }, () => left.float())).toEqual(Array.from({ length: 5 }, () => right.float()));
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(1, 2, 4));
  });

  it('inverts the normal distribution', () => {
    for (const probability of [0.01, 0.2, 0.5, 0.8, 0.99]) {
      expect(normalCdf(normalQuantile(probability))).toBeCloseTo(probability, 3);
    }
  });
});

describe('createMockWorld', () => {
  it('is deterministic for a seed', () => {
    const again = createMockWorld({ catalog: fixtureCatalog, players: 3000, clans: 90 });

    expect(again.players.map((player) => [player.accountId, player.nickname])).toEqual(
      fixtureWorld.players.map((player) => [player.accountId, player.nickname])
    );

    expect(again.clans.map((clan) => clan.tag)).toEqual(fixtureWorld.clans.map((clan) => clan.tag));
  });

  it('issues unique RU-range account ids that grow with the creation date', () => {
    const ids = fixtureWorld.players.map((player) => player.accountId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id, index) => index === 0 || id > (ids[index - 1] ?? 0))).toBe(true);
    expect(Math.min(...ids)).toBeGreaterThan(0);
    expect(Math.max(...ids)).toBeLessThan(120_000_000);

    expect(
      fixtureWorld.players.every((player) => player.createdAt >= MOCK_WORLD.firstAccountAt && player.createdAt <= MOCK_WORLD.lastAccountAt)
    ).toBe(true);
  });

  it('generates unique game-valid nicknames', () => {
    const nicknames = fixtureWorld.players.map((player) => player.nickname);

    expect(new Set(nicknames.map((nickname) => nickname.toLowerCase())).size).toBe(nicknames.length);
    expect(nicknames.every((nickname) => /^\w{3,24}$/.test(nickname))).toBe(true);
  });

  it('keeps every player in at most one clan at a time and gives every clan one commander', () => {
    const at = MOCK_TIME.anchor + 120 * DAY;

    for (const player of fixtureWorld.players) {
      const active = player.stints.filter((stint) => stint.joinedAt <= at && (stint.leftAt === null || stint.leftAt > at));

      expect(active.length).toBeLessThanOrEqual(1);
    }

    for (const clan of fixtureWorld.clans.filter((entry) => clanMembersAt(entry, at).length > 0)) {
      const members = clanMembersAt(clan, at);

      expect(members.filter(({ stint }) => stint.role === 'commander')).toHaveLength(1);
      expect(members.every(({ player }) => stintAt(player, at)?.clanId === clan.clanId)).toBe(true);
    }

    expect(new Set(fixtureWorld.clans.map((clan) => clan.tag)).size).toBe(fixtureWorld.clans.length);
  });
});

describe('selectFields', () => {
  it('keeps listed paths and drops excluded ones', () => {
    const value = { a: 1, b: { c: 2, d: 3 }, list: [{ x: 1, y: 2 }] };

    expect(selectFields(value, ['a', 'b.c'])).toEqual({ a: 1, b: { c: 2 } });
    expect(selectFields(value, ['-b.d', '-list'])).toEqual({ a: 1, b: { c: 2 } });
    expect(selectFields(value, ['list.x'])).toEqual({ list: [{ x: 1 }] });
  });
});

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
