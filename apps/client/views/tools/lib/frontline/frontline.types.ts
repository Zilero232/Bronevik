import type { FrontlineReserve } from '../../config';

export type FrontlinePlanInput = {
  level: number;
  levelXp: number;
  battleXp: number;
  prestige: number;
  targetPrestige: number;
  battlesPerDay: number;
};

export type FrontlineNextReserve = {
  reserve: FrontlineReserve;
  level: number;
  battles: number | null;
};

export type FrontlinePlan = {
  level: number;
  isMaxLevel: boolean;
  xpToNext: number;
  xpToMax: number;
  xpPerCycle: number;
  battlesToNext: number | null;
  battlesToMax: number | null;
  battlesToTarget: number | null;
  daysToTarget: number | null;
  prestigeSteps: number;
  unlocked: FrontlineReserve[];
  nextReserve: FrontlineNextReserve | null;
};

export type XpToLevelInput = {
  level: number;
  levelXp: number;
  target: number;
};
