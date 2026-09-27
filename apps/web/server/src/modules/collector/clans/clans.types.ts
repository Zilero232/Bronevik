import type { ClanInfo } from '../../../lib/lesta';
import type { OwnedProvince } from './lib/clan-provinces';

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

export type ClanActivityInput = {
  clanIds: readonly number[];
  now: Date;
};

export type LestaOrEmptyInput = {
  method: string;
  call: () => Promise<Record<string, unknown>>;
};

export type ReplaceProvincesInput = {
  clanId: bigint;
  provinces: readonly OwnedProvince[];
};
