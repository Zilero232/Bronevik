'use client';

import { Award, SearchX, Target, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { STAGGER } from '@/shared/lib';
import { Card, EmptyState, Skeleton } from '@/ui-kit';

import type { ClosestListProps } from '../../ClosestMarks.types';

import { PLAYER_LOOKUP } from '../../../../../config';
import { usePlayerMarks } from '../../../../../model/hooks';
import { ClosestRow } from '../ClosestRow';

import s from './ClosestList.module.scss';

const SKELETON_ROWS = Array.from({ length: 4 }, (_, index) => index);

export const ClosestList = ({ player }: ClosestListProps) => {
  const t = useTranslations('marks.closest');
  const { nickname, marks, isNotFound, isLoading, isError } = usePlayerMarks(player);

  return (
    <Card className={s.root} padding='lg' variant='sunken'>
      {match({ hasPlayer: player.length > 0, isLoading, isError, isNotFound, isEmpty: marks.length === 0 })
        .with({ hasPlayer: false }, () => <EmptyState description={t('emptyDescription')} icon={<Target size={28} />} title={t('emptyTitle')} />)
        .with({ isLoading: true }, () => (
          <div className={s.list}>
            {SKELETON_ROWS.map((row) => (
              <Skeleton key={row} height={56} width='100%' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <EmptyState description={t('errorHint')} icon={<TriangleAlert size={28} />} title={t('error')} />)
        .with({ isNotFound: true }, () => (
          <EmptyState description={t('notFoundDescription')} icon={<SearchX size={28} />} title={t('notFound', { player })} />
        ))
        .with({ isEmpty: true }, () => <EmptyState description={t('noMarksHint')} icon={<Award size={28} />} title={t('noMarks')} />)
        .otherwise(() => (
          <>
            <p className={s.caption}>{t('playerFor', { nickname })}</p>
            <motion.ol animate='visible' className={s.list} initial='hidden' variants={STAGGER}>
              {marks.slice(0, PLAYER_LOOKUP.closestLimit).map((mark, index) => (
                <ClosestRow key={mark.vehicle.tankId} index={index} mark={mark} />
              ))}
            </motion.ol>
          </>
        ))}
    </Card>
  );
};
