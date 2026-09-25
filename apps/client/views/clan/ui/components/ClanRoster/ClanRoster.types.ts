import type { ClanMember } from '@bronevik/schemas';

export type ClanRosterProps = {
  members: ClanMember[];
  now: string;
};
