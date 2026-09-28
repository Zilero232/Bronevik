'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure } from '@/ui-kit';

import type { ChallengeTimeLeftProps } from './ChallengeTimeLeft.types';

import { useChallengeTimeLeft } from '../../../model/hooks';

export const ChallengeTimeLeft = ({ endsAt }: ChallengeTimeLeftProps) => {
  const t = useTranslations('social.challenges.figures');
  const timeLeft = useChallengeTimeLeft(endsAt);

  return <KeyFigure label={t('left')} value={timeLeft ? t('timeLeft', timeLeft) : '—'} variant='compact' />;
};
