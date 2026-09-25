import type { InactiveFilter, RoleFilter } from '../../../../../lib/roster';

export type RosterFiltersProps = {
  role: RoleFilter;
  idle: InactiveFilter;
  isFiltered: boolean;
  onRoleChange: (role: RoleFilter) => void;
  onIdleChange: (idle: InactiveFilter) => void;
  onReset: () => void;
};
