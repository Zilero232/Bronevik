import type { ClanMemberEvent } from '@otmetki/schemas';

import type { ClanMember, ClanRole } from '../../../../../../generated';

type StoredMember = Pick<ClanMember, 'accountId' | 'role'>;

export type CurrentMember = Pick<ClanMember, 'accountId' | 'joinedAt' | 'role'>;

export type DiffClanRosterInput = {
  stored: readonly StoredMember[];
  current: readonly CurrentMember[];
};

type RoleChange = {
  accountId: bigint;
  oldRole: ClanRole;
  newRole: ClanRole;
};

export type ClanRosterDiff = {
  joined: CurrentMember[];
  left: bigint[];
  roleChanged: RoleChange[];
};

export type ClanMemberEventsInput = {
  clanId: bigint;
  diff: ClanRosterDiff;
  now: Date;
};

export type RosterChange = Omit<ClanMemberEvent, 'nickname'>;
