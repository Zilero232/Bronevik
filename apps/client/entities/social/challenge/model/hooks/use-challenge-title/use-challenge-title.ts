'use client';

import { useTranslations } from 'next-intl';

import type { ChallengeRule } from './use-challenge-title.types';

export const useChallengeTitle = () => {
  const t = useTranslations('social.challenges.titles');
  const tGame = useTranslations('game.classes');

  return (rule: ChallengeRule): string =>
    t(rule.metric, {
      target: rule.target,
      threshold: rule.threshold ?? 0,
      vehicle: rule.vehicleType ? tGame(rule.vehicleType) : 'none'
    });
};
