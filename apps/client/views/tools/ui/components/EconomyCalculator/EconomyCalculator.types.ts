import type { ShellKind } from '../../../config';
import type { EconomyValues } from '../../../model/hooks';

export type EconomyShellsProps = {
  values: EconomyValues;
  onChange: (change: { key: `${ShellKind}Price` | ShellKind; value: number | null }) => void;
};

export type EconomyResultsProps = {
  values: EconomyValues;
};
