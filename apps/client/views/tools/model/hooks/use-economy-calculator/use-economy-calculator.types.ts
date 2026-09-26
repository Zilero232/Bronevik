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
