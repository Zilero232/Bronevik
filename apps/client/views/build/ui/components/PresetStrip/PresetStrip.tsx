'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { buildKey } from '@/entities/tank/build';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { buildQueries } from '../../../api';
import { BUILD_SKELETON } from '../../../config';
import { useBuildContext } from '../../../model/context';
import { PresetCard } from './components';

import s from './PresetStrip.module.scss';

export const PresetStrip = () => {
  const t = useTranslations('builds.presets');
  const { vehicle } = useBuildContext();
  const query = useQuery(buildQueries.popular(vehicle.tankId));

  return (
    <section aria-label={t('title')} className={s.root}>
      <header className={s.head}>
        <h2 className={s.title}>{t('title')}</h2>
        <p className={s.description}>{t('description')}</p>
      </header>
      <QueryState
        skeleton={
          <div className={s.grid}>
            <Skeleton count={BUILD_SKELETON.presets} height={120} />
          </div>
        }
        empty={<EmptyState title={t('empty')} />}
        errorTitle={t('error')}
        isEmpty={({ builds }) => builds.length === 0}
        query={query}
      >
        {({ builds, source }) => (
          <ol className={s.grid}>
            {builds.map((preset) => (
              <PresetCard key={buildKey(preset)} preset={preset} source={source} />
            ))}
          </ol>
        )}
      </QueryState>
    </section>
  );
};
