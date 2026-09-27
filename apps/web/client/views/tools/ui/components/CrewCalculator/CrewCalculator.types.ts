import type { CrewBonus } from '../../../config';

export type CrewValues = Record<CrewBonus, boolean> & {
  skill: number;
  percent: number;
  xpPerBattle: number | null;
  bookXp: number | null;
};

export type CrewResultsProps = {
  values: CrewValues;
};
