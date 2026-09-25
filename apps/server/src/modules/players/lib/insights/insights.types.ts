export type InsightTank = {
  tankId: number;
  type: string;
  tier: number;
  battles: number;
  winRate: number;
  avgDamage: number;
  serverWinRate: number | null;
  serverAvgDamage: number | null;
};

export type TankInsight = {
  tankId: number;
  battles: number;
  winRate: number;
  serverWinRate: number | null;
  winRateDelta: number | null;
  avgDamage: number;
  serverAvgDamage: number | null;
  damageRatio: number | null;
};

export type GroupInsight = {
  key: string;
  battles: number;
  winRate: number | null;
  serverWinRate: number | null;
  winRateDelta: number | null;
  damageRatio: number | null;
};

type InsightTipCode = 'low_damage_tank' | 'no_weak_spots' | 'not_enough_battles' | 'weak_class' | 'weak_tier';

export type InsightTip = {
  code: InsightTipCode;
  params: Record<string, number | string>;
};

export type Insights = {
  battles: number;
  byClass: GroupInsight[];
  byTier: GroupInsight[];
  weakTanks: TankInsight[];
  strongTanks: TankInsight[];
  tips: InsightTip[];
};

export type ComputeInsightsInput = {
  tanks: InsightTank[];
  minBattles: number;
};

export type WeightedMeanInput = {
  tanks: InsightTank[];
  pick: (tank: InsightTank) => number | null;
};

export type GroupsOfInput = {
  tanks: InsightTank[];
  keyOf: (tank: InsightTank) => string;
};

export type TipsInput = {
  byClass: GroupInsight[];
  byTier: GroupInsight[];
  weakTanks: TankInsight[];
  battles: number;
};
