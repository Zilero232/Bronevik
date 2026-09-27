import { describe, expect, it } from 'vitest';

import { clanMembersAt, createMockWorld, stintAt } from '..';
import { MOCK_TIME, MOCK_WORLD } from '../../../config';
import { DAY, fixtureCatalog, fixtureWorld } from './fixtures';

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

    for (const clan of fixtureWorld.clans.filter((entry) => clanMembersAt({ clan: entry, at }).length > 0)) {
      const members = clanMembersAt({ clan, at });

      expect(members.filter(({ stint }) => stint.role === 'commander')).toHaveLength(1);
      expect(members.every(({ player }) => stintAt({ player, at })?.clanId === clan.clanId)).toBe(true);
    }

    expect(new Set(fixtureWorld.clans.map((clan) => clan.tag)).size).toBe(fixtureWorld.clans.length);
  });
});
