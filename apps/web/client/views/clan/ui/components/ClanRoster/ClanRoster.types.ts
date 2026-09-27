import type { ClanMember } from '@otmetki/schemas';

export type ClanRosterProps = {
  members: ClanMember[];
  now: string;
};
