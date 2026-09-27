import type { ClanSummary } from '@otmetki/schemas';

export type ClanCellProps = {
  clan: Pick<ClanSummary, 'color' | 'emblem' | 'tag'>;
};
