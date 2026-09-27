import type { WorkspaceRosterRow } from '../../../../../model/hooks';

export type AttendanceCellProps = {
  row: Pick<WorkspaceRosterRow, 'attended' | 'rate' | 'total'>;
};
