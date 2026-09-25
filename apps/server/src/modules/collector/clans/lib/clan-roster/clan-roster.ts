import type { Prisma } from '../../../../../../generated';
import type { ClanMemberEventsInput, ClanRosterDiff, DiffClanRosterInput, RosterChange } from './clan-roster.types';

import { CLAN_ROLE_FROM_DB, toNumber } from '../../../../../common/lib';

export const diffClanRoster = ({ stored, current }: DiffClanRosterInput): ClanRosterDiff => {
  const before = new Map(stored.map((member) => [member.accountId, member]));
  const after = new Set(current.map((member) => member.accountId));
  const diff: ClanRosterDiff = { joined: [], left: [], roleChanged: [] };

  for (const member of current) {
    const previous = before.get(member.accountId);

    if (!previous) {
      diff.joined.push(member);

      continue;
    }

    if (previous.role !== member.role) {
      diff.roleChanged.push({ accountId: member.accountId, oldRole: previous.role, newRole: member.role });
    }
  }

  for (const member of stored) {
    if (!after.has(member.accountId)) {
      diff.left.push(member.accountId);
    }
  }

  return diff;
};

export const clanMemberEvents = ({ clanId, diff, now }: ClanMemberEventsInput): Prisma.ClanMemberEventCreateManyInput[] => [
  ...diff.joined.map((member) => ({
    clanId,
    accountId: member.accountId,
    type: 'joined' as const,
    newRole: member.role,
    occurredAt: member.joinedAt ?? now
  })),
  ...diff.left.map((accountId) => ({ clanId, accountId, type: 'left' as const, occurredAt: now })),
  ...diff.roleChanged.map((change) => ({
    clanId,
    accountId: change.accountId,
    type: 'roleChanged' as const,
    oldRole: change.oldRole,
    newRole: change.newRole,
    occurredAt: now
  }))
];

export const rosterChanges = (events: readonly Prisma.ClanMemberEventCreateManyInput[]): RosterChange[] =>
  events.map((event) => ({
    accountId: toNumber(BigInt(event.accountId)),
    type: event.type === 'roleChanged' ? 'role_changed' : event.type,
    oldRole: event.oldRole ? CLAN_ROLE_FROM_DB[event.oldRole] : null,
    newRole: event.newRole ? CLAN_ROLE_FROM_DB[event.newRole] : null,
    occurredAt: new Date(event.occurredAt).toISOString()
  }));
