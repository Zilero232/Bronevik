import type { LeaderboardEntry } from '@otmetki/schemas';

import type { DataTableRowLink } from '@/ui-kit';

import { ROUTES } from '@/shared/constants';

export const entrantLink = ({ accountId, clanTag, name }: LeaderboardEntry): DataTableRowLink => ({
  href: accountId === null ? ROUTES.clans.detail(clanTag ?? name) : ROUTES.players.profile(name),
  label: name,
  hasCellLink: true
});
