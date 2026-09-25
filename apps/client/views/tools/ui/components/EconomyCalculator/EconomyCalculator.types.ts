import type { ShellKind } from '../../../config';

export type EconomyValues = Record<ShellKind, number | null> &
  Record<`${ShellKind}Price`, number | null> & {
    tier: number;
    isPremiumVehicle: boolean;
    damage: number | null;
    spotting: number | null;
    standard: number | null;
    premium: number | null;
  };

export type EconomyShellsProps = {
  values: EconomyValues;
  onChange: (change: { key: `${ShellKind}Price` | ShellKind; value: number | null }) => void;
};

export type EconomyResultsProps = {
  values: EconomyValues;
};
