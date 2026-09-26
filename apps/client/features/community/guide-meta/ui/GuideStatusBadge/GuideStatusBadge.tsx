'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { GuideStatusBadgeProps } from './GuideStatusBadge.types';

import { GUIDE_STATUS_TONE } from '../../config';

export const GuideStatusBadge = ({ status, className }: GuideStatusBadgeProps) => {
  const t = useTranslations('guides.status');

  return (
    <Badge className={className} tone={GUIDE_STATUS_TONE[status]}>
      {t(status)}
    </Badge>
  );
};
