import type { EconomyAccount, TankEconomy } from '@otmetki/schemas';

export type EconomyViewInput = {
  economy: TankEconomy;
  account: EconomyAccount;
  withReserve: boolean;
  withClanPayout?: boolean;
};

export type EconomyView = {
  battles: number;
  players: number;
  credits: number | null;
  net: number | null;
  costs: number | null;
  repair: number | null;
  ammo: number | null;
  consumables: number | null;
  xp: number | null;
  freeXp: number | null;
};

export type BonusOfInput = {
  creditsBase: number | null;
  withReserve: boolean;
  withClanPayout: boolean;
};
