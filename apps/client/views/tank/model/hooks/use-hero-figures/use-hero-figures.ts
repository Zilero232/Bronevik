'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ratingTone } from '@/shared/lib';

import type { HeroFigure } from './use-hero-figures.types';

import { HERO_FIGURES } from '../../../config';
import { cohortRow } from '../../../lib';
import { useTank } from '../../context';

export const useHeroFigures = () => {
  const t = useTranslations('tank.garage.figures');
  const { detail } = useTank();

  const row = cohortRow({ rows: detail.serverStats, cohort: 'all' });

  const figures: HeroFigure[] = HERO_FIGURES.flatMap((key) => {
    const value = match(key)
      .with('winRate', () => row?.winRate ?? null)
      .with('avgDamage', () => row?.avgDamage ?? null)
      .with('mark3', () => detail.moe?.p95 ?? null)
      .exhaustive();

    if (value === null) {
      return [];
    }

    return [
      {
        key,
        label: t(key),
        value,
        format: { maximumFractionDigits: key === 'winRate' ? 2 : 0 },
        suffix: key === 'winRate' ? ' %' : undefined,
        tone: key === 'winRate' ? ratingTone({ scale: 'winRate', value }) : undefined
      }
    ];
  });

  return { figures };
};
