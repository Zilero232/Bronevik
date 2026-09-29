'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { SectionHeader } from '@/ui-kit';

import type { DailyPuzzleShelfProps } from './DailyPuzzleShelf.types';

import { otherPuzzles } from '../../lib/puzzle-catalog';
import { DailyPuzzleCard } from '../DailyPuzzleCard';

import s from './DailyPuzzleShelf.module.scss';

export const DailyPuzzleShelf = ({ current }: DailyPuzzleShelfProps) => {
  const t = useTranslations('play.hub.shelf');

  return (
    <section className={s.root}>
      <SectionHeader more={{ href: ROUTES.play.hub, label: t('all') }} title={t('title')} />
      <div className={s.grid}>
        {otherPuzzles(current).map((puzzle) => (
          <DailyPuzzleCard key={puzzle} puzzle={puzzle} size='sm' titleAs='h3' />
        ))}
      </div>
    </section>
  );
};
