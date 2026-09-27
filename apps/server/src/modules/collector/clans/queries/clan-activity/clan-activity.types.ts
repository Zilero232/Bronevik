import type { ClanSnapshot } from '../../../../../../generated';

export type ClanActivityRow = Pick<ClanSnapshot, 'activeMembers7d' | 'avgWinRate' | 'avgWn8' | 'battlesDelta' | 'clanId'>;

export type ClanActivitySqlInput = {
  clanIds: readonly bigint[];
  battlesSince: Date;
  activeSince: Date;
};
