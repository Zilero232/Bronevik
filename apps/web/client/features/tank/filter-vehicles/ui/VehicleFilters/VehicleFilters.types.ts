import type { ReactNode } from 'react';

import type { FilterBarProps } from '@/ui-kit';

import type { UseVehicleFiltersViewInput } from '../../model/hooks';

export type VehicleFiltersProps = UseVehicleFiltersViewInput &
  Pick<FilterBarProps, 'actions' | 'className' | 'more' | 'moreLabel' | 'primary' | 'variant'> & {
    withStatuses?: boolean;
    withRoles?: boolean;
    label?: string;
    leading?: ReactNode;
    children?: ReactNode;
  };
