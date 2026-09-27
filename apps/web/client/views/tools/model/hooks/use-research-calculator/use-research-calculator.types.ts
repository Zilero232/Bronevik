import type { RESEARCH } from '../../../config';

export type ResearchValues = { -readonly [K in keyof typeof RESEARCH.defaults]: number } & {
  isPremium: boolean;
};
