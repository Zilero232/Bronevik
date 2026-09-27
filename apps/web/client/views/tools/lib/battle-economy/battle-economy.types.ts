import type { ShellKind } from '../../config';

export type BattleEconomyInput = {
  tier: number;
  isPremiumVehicle: boolean;
  damage: number;
  spotting: number;
  shells: Record<ShellKind, number>;
  prices: Record<ShellKind, number>;
  consumables: { standard: number; premium: number };
};

export type BattleEconomy = {
  gross: number;
  grossPremium: number;
  repair: number;
  ammo: number;
  consumables: number;
  net: number;
  netPremium: number;
};
