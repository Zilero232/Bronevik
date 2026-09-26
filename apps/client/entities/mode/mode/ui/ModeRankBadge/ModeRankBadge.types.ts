import type { ModeRank } from '@otmetki/schemas';

export type ModeRankBadgeProps = {
  rank: ModeRank | null;
  size?: 'md' | 'sm';
  className?: string;
};
