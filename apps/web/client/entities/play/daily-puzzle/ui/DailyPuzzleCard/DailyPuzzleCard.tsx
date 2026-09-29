'use client';

import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { DailyPuzzleCardProps } from './DailyPuzzleCard.types';

import { DAILY_PUZZLES } from '../../config';
import { useDailyStatus } from '../../model/hooks';
import { PuzzleStatus } from './components';

import s from './DailyPuzzleCard.module.scss';

export const DailyPuzzleCard = ({ puzzle, size = 'lg', titleAs: Title = 'h2' }: DailyPuzzleCardProps) => {
  const t = useTranslations('play.hub');
  const { status, number, clock } = useDailyStatus(puzzle);
  const { href, icon: Icon } = DAILY_PUZZLES[puzzle];

  return (
    <Link className={s.root} data-puzzle={puzzle} data-size={size} data-status={status?.kind ?? 'pending'} href={href}>
      <span aria-hidden className={s.art}>
        <span className={s.scope} />
        <Icon className={s.icon} strokeWidth={1} />
        <span className={s.mark}>{t('card.mark')}</span>
      </span>
      <span className={s.body}>
        <span className={s.kicker}>{number === null ? t('card.kicker') : t('card.kickerNumber', { number })}</span>
        <Title className={s.title}>{t(`games.${puzzle}.title`)}</Title>
        <span className={s.description}>{t(`games.${puzzle}.description`)}</span>
        <PuzzleStatus clock={clock} status={status} />
        <span className={clsx(buttonVariants({ variant: status?.isDone ? 'secondary' : 'primary', size: 'md' }), s.cta)}>
          {t(`card.cta.${status?.kind ?? 'fresh'}`)}
          <ArrowRight aria-hidden size={16} />
        </span>
      </span>
    </Link>
  );
};
