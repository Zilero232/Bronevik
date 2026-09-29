import type { TankRole } from '@otmetki/schemas';

import type { ActiveFilter } from '@/ui-kit';

import type { ANY_ROLE } from '../../../config';

export type RoleChoice = TankRole | typeof ANY_ROLE;

export type UseVehicleFiltersViewInput = {
  extraActive?: readonly ActiveFilter[];
  onExtraReset?: () => void;
};

export type FilterChipInput = {
  id: string;
  label: string;
  values: readonly string[];
  onRemove: () => void;
};
