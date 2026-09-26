import type { ClanSummary } from '@bronevik/schemas';

export type ClanCellProps = {
  clan: Pick<ClanSummary, 'color' | 'emblem' | 'tag'>;
};
