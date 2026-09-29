'use client';

import { useTranslations } from 'next-intl';

import { DailyResult } from '@/entities/play/daily-puzzle';
import { ROUTES } from '@/shared/constants';

import { useMapResult } from '../../../model/hooks';

export const MapResult = () => {
  const t = useTranslations('play.map.result');
  const { target, guessCount, isWon, streak, currentStreak, refreshDay, onShare } = useMapResult();

  return (
    <DailyResult
      currentStreak={currentStreak}
      detail={{ href: ROUTES.maps.detail(target.slug), label: t('openMap') }}
      shareLabel={t('share')}
      status={isWon ? 'won' : 'lost'}
      streak={streak}
      text={t(isWon ? 'wonText' : 'lostText', { name: target.name })}
      title={isWon ? t('wonTitle', { count: guessCount }) : t('lostTitle')}
      onExpire={refreshDay}
      onShare={onShare}
    />
  );
};
