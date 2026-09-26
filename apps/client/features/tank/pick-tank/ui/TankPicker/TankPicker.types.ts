import type { VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type TankPickerProps = {
  value: VehicleSummary | null;
  label?: ReactNode;
  placeholder?: string;
  excludeIds?: readonly number[];
  className?: string;
  onChange: (vehicle: VehicleSummary | null) => void;
};
