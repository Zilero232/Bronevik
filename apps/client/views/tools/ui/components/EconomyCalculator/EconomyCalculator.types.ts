import type { VehicleSummary } from '@otmetki/schemas';

import type { EconomyView } from '@/entities/tank/tank';

import type { ShellKind } from '../../../config';
import type { EconomyValues } from '../../../model/hooks';

export type EconomyShellsProps = {
  values: EconomyValues;
  onChange: (change: { key: `${ShellKind}Price` | ShellKind; value: number | null }) => void;
};

export type EconomyResultsProps = {
  values: EconomyValues;
};

export type RealMediansProps = {
  vehicle: VehicleSummary | null;
  medians: { premium: EconomyView | null; standard: EconomyView | null; windowDays: number };
  isPending: boolean;
  isError: boolean;
};
