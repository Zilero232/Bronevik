import type { EquipCosmeticsInput, OverlayTheme, ShellReason, TankChallengeMetric } from '@otmetki/schemas';

import type { Prisma } from '../../../generated';
import type { WeekWindow } from '../../common/lib';

export type TankChallengeDefinition = {
  metric: TankChallengeMetric;
  target?: number;
  targetPerTier?: number;
  thresholdPerTier?: number;
  minTier: number;
  needsMod: boolean;
};

type ProgressionTx = Prisma.TransactionClient;

export type GrantShellsInput = {
  userId: string;
  amount: number;
  reason: ShellReason;
  key: string;
  points: number;
  now: Date;
  context?: Record<string, number | string>;
};

export type SpendShellsInput = {
  userId: string;
  amount: number;
  key: string;
  context?: Record<string, number | string>;
  tx: ProgressionTx;
};

export type BalanceInput = {
  userId: string;
  client: ProgressionTx;
};

export type AccountRunInput = {
  userId: string;
  accountId: bigint;
  now: Date;
};

export type LoadSamplesInput = {
  accountId: bigint;
  from: Date;
  to: Date;
};

export type ProgressVehicle = {
  tier: number;
  name: string;
};

export type ApplyXpInput = AccountRunInput & {
  gains: ReadonlyMap<number, { xp: number; battles: number }>;
  vehicles: ReadonlyMap<number, ProgressVehicle>;
};

export type EvaluateChallengesInput = AccountRunInput & {
  week: WeekWindow;
};

export type PurchaseCosmeticInput = {
  userId: string;
  code: string;
};

export type EquipCosmeticsRequest = EquipCosmeticsInput & {
  userId: string;
};

export type UserAtInput = {
  userId: string;
  now: Date;
};

export type OverlayThemeInput = {
  userId: string;
  theme: OverlayTheme;
};
