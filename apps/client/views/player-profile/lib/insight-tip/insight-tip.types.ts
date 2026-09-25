import type { PlayerInsights } from '@bronevik/schemas';

export type InsightTip = PlayerInsights['tips'][number];

export type TipValues = Record<string, number | string>;

export type TipValuesInput = {
  tip: InsightTip;
  insights: PlayerInsights;
};
