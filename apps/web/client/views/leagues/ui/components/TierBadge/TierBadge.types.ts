import type { LeagueTier } from '@/entities/social/league';

export type TierBadgeProps = {
  tier: LeagueTier;
  size?: 'lg' | 'sm';
};
