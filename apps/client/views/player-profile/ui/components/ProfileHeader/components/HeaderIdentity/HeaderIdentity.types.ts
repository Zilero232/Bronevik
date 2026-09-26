import type { PlayerProfile } from '@otmetki/schemas';

export type HeaderIdentityProps = {
  summary: PlayerProfile['summary'];
  badge: string | null;
};
