import type { ClanRole } from '../../../../../../generated';

type StoredMember = {
  accountId: bigint;
  role: ClanRole;
};

export type CurrentMember = {
  accountId: bigint;
  role: ClanRole;
  joinedAt: Date | null;
};

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

export type RosterChange = {
  accountId: number;
  type: 'joined' | 'kicked' | 'left' | 'role_changed';
  oldRole: string | null;
  newRole: string | null;
  occurredAt: string;
};
