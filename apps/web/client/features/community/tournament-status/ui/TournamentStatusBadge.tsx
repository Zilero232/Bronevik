'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { TournamentStatusBadgeProps } from './TournamentStatusBadge.types';

import { TOURNAMENT_STATUS_TONE } from '../config';

export const TournamentStatusBadge = ({ status, className }: TournamentStatusBadgeProps) => {
  const t = useTranslations('tournaments.status');

  return (
    <Badge className={className} tone={TOURNAMENT_STATUS_TONE[status]}>
      {t(status)}
    </Badge>
  );
};
