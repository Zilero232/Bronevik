'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { MarkProgress } from '@/entities/player/marks';
import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { ClosestListProps } from './ClosestList.types';

import { PLAYER_LOOKUP } from '../../../../../config';
import { usePlayerMarks } from '../../../../../model/hooks';

import s from './ClosestList.module.scss';

export const ClosestList = ({ player }: ClosestListProps) => {
  const t = useTranslations('marks.closest');
  const { nickname, hasPlayer, isNotFound, query } = usePlayerMarks(player);

  return match({ hasPlayer, isNotFound })
    .with({ hasPlayer: false }, () => <p className={s.hint}>{t('hint')}</p>)
    .with({ isNotFound: true }, () => <EmptyState description={t('notFoundDescription')} title={t('notFound', { player })} />)
    .otherwise(() => (
      <QueryState
        skeleton={
          <div aria-busy className={s.list}>
            {PLAYER_LOOKUP.skeletonRows.map((row) => (
              <Skeleton key={row} height={112} width='100%' />
            ))}
          </div>
        }
        empty={<EmptyState description={t('noMarksHint')} title={t('noMarks')} />}
        errorTitle={t('error')}
        query={query}
      >
        {(marks) => (
          <div className={s.root}>
            <p className={s.caption}>{t('playerFor', { nickname })}</p>
            <ol className={s.list}>
              {marks.map((mark) => (
                <MarkProgress
                  key={mark.vehicle.tankId}
                  title={
                    <Link className={s.tank} href={ROUTES.tanks.detail(mark.vehicle.slug)}>
                      <TankCell image='contour' vehicle={mark.vehicle} />
                    </Link>
                  }
                  as='li'
                  damageToNext={mark.damageToNext}
                  percent={mark.percent}
                  variant='card'
                />
              ))}
            </ol>
          </div>
        )}
      </QueryState>
    ));
};
