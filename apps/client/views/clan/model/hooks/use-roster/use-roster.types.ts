import type { ClanMember } from '@otmetki/schemas';

export type UseRosterInput = {
  members: readonly ClanMember[];
  now: string;
};
