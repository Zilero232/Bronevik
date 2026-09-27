import type { WorkspaceRosterRow } from '../../../../../model/hooks';

export type RoleCellProps = Pick<WorkspaceRosterRow, 'isOfficer' | 'role'>;
