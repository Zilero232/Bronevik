'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { buildKey } from '@/entities/tank/build';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { BUILD_SKELETON } from '../../../config';
import { useBuildContext } from '../../../model/context';
import { usePopularBuilds } from '../../../model/hooks';
import { PresetCard } from './components';

import s from './PresetStrip.module.scss';

export const PresetStrip = () => {
  const t = useTranslations('builds.presets');
  const { vehicle } = useBuildContext();
  const { data, isPending, isError, isFetching, refetch } = usePopularBuilds(vehicle.tankId);

  return (
    <section aria-label={t('title')} className={s.root}>
      <header className={s.head}>
        <h2 className={s.title}>{t('title')}</h2>
        <p className={s.description}>{t('description')}</p>
      </header>
      {match({ isPending, isError, count: data?.builds.length ?? 0 })
        .with({ isPending: true }, () => (
          <div className={s.grid}>
            {BUILD_SKELETON.presets.map((key) => (
              <Skeleton key={key} height={120} />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} title={t('error')} onRetry={() => void refetch()} />)
        .with({ count: 0 }, () => <EmptyState title={t('empty')} />)
        .otherwise(() => (
          <ol className={s.grid}>
            {data?.builds.map((preset) => (
              <PresetCard key={buildKey(preset)} preset={preset} source={data.source} />
            ))}
          </ol>
        ))}
    </section>
  );
};
