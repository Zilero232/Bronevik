import type { VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import type { FormControlA11y } from '@/shared/lib';

export type TankPickerProps = FormControlA11y & {
  value: VehicleSummary | null;
  label?: ReactNode;
  placeholder?: string;
  excludeIds?: readonly number[];
  className?: string;
  onChange: (vehicle: VehicleSummary | null) => void;
};
