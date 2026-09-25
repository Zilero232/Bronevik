import { describe, expect, it } from 'vitest';

import { CLAN_ROLE_FROM_DB } from '../../../../../../common/lib';
import { clanMemberEvents, diffClanRoster, rosterChanges } from '../clan-roster';

const now = new Date('2026-09-24T12:00:00Z');
const joinedAt = new Date('2026-09-20T12:00:00Z');

describe('diffClanRoster', () => {
  const diff = diffClanRoster({
    stored: [
      { accountId: 1n, role: 'commander' },
      { accountId: 2n, role: 'private' },
      { accountId: 3n, role: 'recruit' }
    ],
    current: [
      { accountId: 1n, role: 'commander', joinedAt: null },
      { accountId: 3n, role: 'private', joinedAt: null },
      { accountId: 4n, role: 'recruit', joinedAt }
    ]
  });

  it('finds joins, leaves and role changes', () => {
    expect(diff.joined.map((member) => member.accountId)).toEqual([4n]);
    expect(diff.left).toEqual([2n]);
    expect(diff.roleChanged).toEqual([{ accountId: 3n, oldRole: 'recruit', newRole: 'private' }]);
  });

  it('dates a join by the Lesta joined_at and a leave by the observation time', () => {
    const events = clanMemberEvents({ clanId: 10n, diff, now });

    expect(events.find((event) => event.type === 'joined')?.occurredAt).toEqual(joinedAt);
    expect(events.find((event) => event.type === 'left')?.occurredAt).toEqual(now);
    expect(events).toHaveLength(3);
  });

  it('reports nothing when the roster is unchanged', () => {
    const same = diffClanRoster({ stored: [{ accountId: 1n, role: 'private' }], current: [{ accountId: 1n, role: 'private', joinedAt: null }] });

    expect(clanMemberEvents({ clanId: 10n, diff: same, now })).toEqual([]);
  });
});

describe('rosterChanges', () => {
  it('translates events into the public roster shape', () => {
    expect(
      rosterChanges([
        { clanId: 10n, accountId: 3n, type: 'roleChanged', oldRole: 'juniorOfficer', newRole: 'private', occurredAt: now },
        { clanId: 10n, accountId: 4n, type: 'joined', newRole: 'recruit', occurredAt: joinedAt.toISOString() }
      ])
    ).toEqual([
      {
        accountId: 3,
        type: 'role_changed',
        oldRole: CLAN_ROLE_FROM_DB.juniorOfficer,
        newRole: CLAN_ROLE_FROM_DB.private,
        occurredAt: now.toISOString()
      },
      { accountId: 4, type: 'joined', oldRole: null, newRole: CLAN_ROLE_FROM_DB.recruit, occurredAt: joinedAt.toISOString() }
    ]);
  });

  it('reports no roles for a member who left', () => {
    const [change] = rosterChanges([{ clanId: 10n, accountId: 2n, type: 'left', occurredAt: now }]);

    expect(change).toMatchObject({ type: 'left', oldRole: null, newRole: null });
  });

  it('keeps the event order and returns nothing for no events', () => {
    const diff = diffClanRoster({ stored: [{ accountId: 2n, role: 'private' }], current: [{ accountId: 4n, role: 'recruit', joinedAt }] });

    expect(rosterChanges(clanMemberEvents({ clanId: 10n, diff, now })).map((change) => change.type)).toEqual(['joined', 'left']);
    expect(rosterChanges([])).toEqual([]);
  });
});
