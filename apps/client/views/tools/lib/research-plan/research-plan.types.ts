import type { TechTreeNode } from '@bronevik/schemas';

export type ResearchCostInput = {
  tier: number;
  node: TechTreeNode | null;
};

export type ResearchCost = {
  xp: number;
  credits: number;
  source: 'tier' | 'tree';
};

export type ResearchPlanInput = {
  cost: Pick<ResearchCost, 'credits' | 'xp'>;
  currentXp: number;
  freeXp: number;
  credits: number;
  xpPerBattle: number;
  creditsPerBattle: number;
  isPremium: boolean;
  battlesPerDay: number;
};

export type ResearchPlan = {
  xpLeft: number;
  creditsLeft: number;
  battlesForXp: number | null;
  battlesForCredits: number | null;
  battles: number | null;
  days: number | null;
  progress: number;
};

export type BattlesForInput = {
  left: number;
  perBattle: number;
};
