import type { BattlesForInput, ResearchCost, ResearchCostInput, ResearchPlan, ResearchPlanInput } from './research-plan.types';

import { RESEARCH, RESEARCH_COSTS } from '../../config';

export const battlesFor = ({ left, perBattle }: BattlesForInput): number | null => {
  if (left <= 0) {
    return 0;
  }

  return perBattle > 0 ? Math.ceil(left / perBattle) : null;
};

export const researchCost = ({ tier, node }: ResearchCostInput): ResearchCost => {
  const fallback = RESEARCH_COSTS[tier] ?? RESEARCH_COSTS[10];

  if (node && node.xp !== null && node.credits !== null) {
    return { xp: node.xp, credits: node.credits, source: 'tree' };
  }

  return { xp: node?.xp ?? fallback.xp, credits: node?.credits ?? fallback.credits, source: 'tier' };
};

export const researchPlan = ({
  cost,
  currentXp,
  freeXp,
  credits,
  xpPerBattle,
  creditsPerBattle,
  isPremium,
  battlesPerDay
}: ResearchPlanInput): ResearchPlan => {
  const multiplier = isPremium ? 1 + RESEARCH.premiumBonus : 1;
  const xpLeft = Math.max(0, cost.xp - currentXp - freeXp);
  const creditsLeft = Math.max(0, cost.credits - credits);
  const battlesForXp = battlesFor({ left: xpLeft, perBattle: xpPerBattle * multiplier });
  const battlesForCredits = battlesFor({ left: creditsLeft, perBattle: creditsPerBattle * multiplier });
  const battles = battlesForXp === null || battlesForCredits === null ? null : Math.max(battlesForXp, battlesForCredits);

  return {
    xpLeft,
    creditsLeft,
    battlesForXp,
    battlesForCredits,
    battles,
    days: battles === null || battlesPerDay <= 0 ? null : Math.ceil(battles / battlesPerDay),
    progress: cost.xp > 0 ? Math.min(1, (cost.xp - xpLeft) / cost.xp) : 1
  };
};
