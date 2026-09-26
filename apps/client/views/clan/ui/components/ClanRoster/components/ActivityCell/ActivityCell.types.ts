import type { RosterRow } from '../../../../../lib/roster';

export type ActivityCellProps = Pick<RosterRow, 'inactiveDays' | 'status'>;
