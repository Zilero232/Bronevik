import type { ClanListItem } from '@otmetki/schemas';

import type { QueryStateSource } from '@/ui-kit';

export type ClanLeadersProps = {
  query: QueryStateSource<ClanListItem[]>;
};
