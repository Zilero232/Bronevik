import type { CrewBonus } from '../../config';

export type SkillLevelCostInput = {
  level: number;
  skill: number;
};

export type XpToNextSkillInput = {
  skill: number;
  percent: number;
};

export type CrewPlanInput = {
  skill: number;
  percent: number;
  xpPerBattle: number;
  bonuses: Record<CrewBonus, boolean>;
  bookXp: number;
};

export type CrewPlan = {
  perBattle: number;
  xpLeft: number;
  battles: number | null;
  upcoming: { skill: number; xp: number; battles: number | null }[];
};
