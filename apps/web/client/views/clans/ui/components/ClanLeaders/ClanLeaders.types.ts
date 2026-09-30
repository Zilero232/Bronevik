import type { ClanListItem } from '@otmetki/schemas';

export type ClanLeadersProps = {
  leaders: ClanListItem[];
  isLoading?: boolean;
};
