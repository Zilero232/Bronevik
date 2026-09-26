'use client';

import { useFormatter, useNow } from 'next-intl';

import type { UseChallengeCardInput } from './use-challenge-card.types';

import { CHALLENGE_NOW_REFRESH_MS } from '../../../config';

export const useChallengeCard = ({ amount, currency, expiresAt }: UseChallengeCardInput) => {
  const format = useFormatter();
  const now = useNow({ updateInterval: CHALLENGE_NOW_REFRESH_MS });

  return {
    amountLabel: format.number(amount, { style: 'currency', currency, maximumFractionDigits: 0 }),
    expiresLabel: expiresAt ? format.relativeTime(new Date(expiresAt), now) : null
  };
};
