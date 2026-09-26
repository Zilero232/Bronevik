import type { PlayerInsights, TankInsight as SchemaTankInsight } from '@otmetki/schemas';

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

export type TankInsight = Omit<SchemaTankInsight, 'vehicle'> & {
  tankId: number;
};

export type InsightTip = PlayerInsights['tips'][number];

export type Insights = Omit<PlayerInsights, 'period' | 'strongTanks' | 'weakTanks'> & {
  weakTanks: TankInsight[];
  strongTanks: TankInsight[];
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

export type TipsInput = Pick<Insights, 'battles' | 'byClass' | 'byTier' | 'weakTanks'>;
