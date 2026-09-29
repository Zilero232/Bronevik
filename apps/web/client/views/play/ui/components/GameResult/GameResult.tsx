'use client';

import { useTranslations } from 'next-intl';

import { DailyResult } from '@/entities/play/daily-puzzle';
import { ROUTES } from '@/shared/constants';

import { useGameResult } from '../../../model/hooks';

export const GameResult = () => {
  const t = useTranslations('play.result');
  const { target, guessCount, isWon, streak, currentStreak, refreshDay, onShare } = useGameResult();

  return (
    <DailyResult
      currentStreak={currentStreak}
      detail={{ href: ROUTES.tanks.detail(target.slug), label: t('openTank') }}
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
