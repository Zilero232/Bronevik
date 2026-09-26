'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { CompetitionStatusBadgeProps } from './CompetitionStatusBadge.types';

import { COMPETITION_STATUS_TONE } from '../../config';

export const CompetitionStatusBadge = ({ status, className }: CompetitionStatusBadgeProps) => {
  const t = useTranslations('competitions.status');

  return (
    <Badge className={className} tone={COMPETITION_STATUS_TONE[status]}>
      {t(status)}
    </Badge>
  );
};
