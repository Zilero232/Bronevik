import type { ClanInfo } from '../../../lib/lesta';

export type SyncClanInput = {
  clanId: number;
  info: ClanInfo | null;
  now: Date;
};

export type ClanFieldsInput = {
  info: ClanInfo | null;
  disbanded: boolean;
  membersCount: number;
  now: Date;
};

export type ClanSnapshotInput = {
  clanIds: readonly number[];
  infos: Record<string, ClanInfo | null>;
  now: Date;
};
