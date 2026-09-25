import type { ClanMember } from '@bronevik/schemas';

export type UseRosterInput = {
  members: readonly ClanMember[];
  now: string;
};
