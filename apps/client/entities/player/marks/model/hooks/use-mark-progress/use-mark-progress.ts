'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import type { UseMarkProgressInput } from './use-mark-progress.types';

import { markRing, markTarget } from '../../../lib/mark-progress';

export const useMarkProgress = ({ percent, damageToNext }: UseMarkProgressInput) => {
  const t = useTranslations('marks.progress');
  const format = useFormatter();

  const { marks, nextMark } = markRing(percent);

  return {
    target: markTarget(marks),
    percentText: format.number(percent / 100, { style: 'percent', maximumFractionDigits: 2 }),
    hint: match({ nextMark, damageToNext })
      .with({ nextMark: null }, () => t('done'))
      .with({ damageToNext: P.number }, ({ damageToNext: damage }) => t('toNext', { mark: marks + 1, damage: `+${format.number(damage)}` }))
      .otherwise(() => t('next', { mark: marks + 1 }))
  };
};
