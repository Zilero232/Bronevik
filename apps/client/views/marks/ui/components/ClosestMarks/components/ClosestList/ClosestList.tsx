'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { ClosestListProps } from './ClosestList.types';

import { PLAYER_LOOKUP } from '../../../../../config';
import { usePlayerMarks } from '../../../../../model/hooks';
import { ClosestRow } from '../ClosestRow';

import s from './ClosestList.module.scss';

export const ClosestList = ({ player }: ClosestListProps) => {
  const t = useTranslations('marks.closest');
  const { nickname, marks, hasPlayer, isNotFound, isLoading, isError, isRetrying, retry } = usePlayerMarks(player);

  return match({ hasPlayer, isLoading, isError, isNotFound, isEmpty: marks.length === 0 })
    .with({ hasPlayer: false }, () => <p className={s.hint}>{t('hint')}</p>)
    .with({ isLoading: true }, () => (
      <div aria-busy className={s.list}>
        {PLAYER_LOOKUP.skeletonRows.map((row) => (
          <Skeleton key={row} height={36} width='100%' />
        ))}
      </div>
    ))
    .with({ isError: true }, () => <ErrorState isRetrying={isRetrying} title={t('error')} onRetry={retry} />)
    .with({ isNotFound: true }, () => <EmptyState description={t('notFoundDescription')} title={t('notFound', { player })} />)
    .with({ isEmpty: true }, () => <EmptyState description={t('noMarksHint')} title={t('noMarks')} />)
    .otherwise(() => (
      <div className={s.root}>
        <p className={s.caption}>{t('playerFor', { nickname })}</p>
        <ol className={s.list}>
          {marks.map((mark) => (
            <ClosestRow key={mark.vehicle.tankId} mark={mark} />
          ))}
        </ol>
      </div>
    ));
};
