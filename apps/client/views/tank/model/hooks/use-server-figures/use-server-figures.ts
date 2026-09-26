'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ratingTone } from '@/shared/lib';

import type { ServerFigure } from './use-server-figures.types';

import { SERVER_FIGURES } from '../../../config';
import { cohortRow } from '../../../lib';
import { useTank } from '../../context';

export const useServerFigures = () => {
  const t = useTranslations('tank.stats');
  const { detail } = useTank();

  const row = cohortRow({ rows: detail.serverStats, cohort: 'all' });

  const figures: ServerFigure[] = row
    ? SERVER_FIGURES.map(({ key, unit, format }) => ({
        key,
        label: t(`figures.${key}`),
        value: row[key],
        format,
        suffix: match(unit)
          .with('percent', () => '\u00A0%')
          .with('pp', () => `\u00A0${t('pp')}`)
          .otherwise(() => undefined),
        tone: key === 'winRate' ? ratingTone({ scale: 'winRate', value: row.winRate }) : undefined
      }))
    : [];

  return { figures };
};
