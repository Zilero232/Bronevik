'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { TierBadgeProps } from './TierBadge.types';

import s from './TierBadge.module.scss';

export const TierBadge = ({ tier, size = 'sm' }: TierBadgeProps) => {
  const t = useTranslations('social.leagues.tiers');

  return (
    <span className={s.root} data-size={size} data-tier={tier}>
      <Shield aria-hidden className={s.icon} size={size === 'lg' ? 28 : 14} />
      <span className={s.label}>{t(tier)}</span>
    </span>
  );
};
