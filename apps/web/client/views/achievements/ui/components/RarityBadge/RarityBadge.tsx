'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { RarityBadgeProps } from './RarityBadge.types';

import { RARITY_TONE } from '../../../config';

export const RarityBadge = ({ tier }: RarityBadgeProps) => {
  const t = useTranslations('achievements.tiers');

  return tier ? <Badge tone={RARITY_TONE[tier]}>{t(tier)}</Badge> : null;
};
