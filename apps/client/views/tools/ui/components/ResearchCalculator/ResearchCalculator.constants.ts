import { RESEARCH } from '../../../config';

const { ranges } = RESEARCH;

export const RESEARCH_FIELDS = [
  { key: 'currentXp', range: ranges.xp },
  { key: 'freeXp', range: ranges.xp },
  { key: 'credits', range: ranges.credits },
  { key: 'xpPerBattle', range: ranges.xpPerBattle },
  { key: 'creditsPerBattle', range: ranges.creditsPerBattle }
] as const;
