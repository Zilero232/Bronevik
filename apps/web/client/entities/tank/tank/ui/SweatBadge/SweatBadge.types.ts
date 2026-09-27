import type { SweatLevel } from '@otmetki/schemas';

export type SweatBadgeProps = {
  level: SweatLevel;
  ratio: number | null;
  kind?: 'mastery' | 'moe';
  className?: string;
};
