import type { EconomyAccount } from '../../../../../../generated';

export type EconomySqlRow = {
  tank_id: number;
  account: EconomyAccount;
  battles: number;
  players: number;
  cost_battles: number;
  credits: number | null;
  credits_base: number | null;
  repair: number | null;
  ammo: number | null;
  consumables: number | null;
  net: number | null;
  xp: number | null;
  free_xp: number | null;
};

export type ToEconomyRecordInput = {
  row: EconomySqlRow;
  windowDays: number;
  computedAt: Date;
};

export type LearningSqlRow = {
  tank_id: number;
  bucket: number;
  battles: number;
  players: number;
  wins: number;
  damage: bigint | number;
};

export type ToLearningRecordInput = {
  row: LearningSqlRow;
  windowDays: number;
  computedAt: Date;
};
