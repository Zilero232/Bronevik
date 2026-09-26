'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { buildKey } from '@/entities/tank/build';
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { usePopularBuilds } from '../../../model/hooks';
import { BuildCard } from './components';

import s from './PopularBuilds.module.scss';

export const PopularBuilds = () => {
  const t = useTranslations('tank.builds');
  const { data, isPending, isError, refetch } = usePopularBuilds();

  return (
    <Card className={s.root} id={TANK_SECTIONS.builds} padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      {match({ list: data?.builds ?? [], source: data?.source ?? 'none', isPending, isError })
        .with({ isPending: true }, () => (
          <div className={s.grid}>
            {Array.from({ length: TANK_PAGE.skeletonBuilds }, (_, index) => (
              <Skeleton key={index} height={240} shape='block' width='100%' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
        .with({ list: [] }, () => <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />)
        .otherwise(({ list, source }) => (
          <ul className={s.grid}>
            {list.map((build, index) => (
              <li key={buildKey(build)} className={s.item}>
                <BuildCard build={build} rank={index + 1} source={source} />
              </li>
            ))}
          </ul>
        ))}
    </Card>
  );
};
