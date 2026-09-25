'use client';

import { Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { buildKey } from '@/entities/tank/build';
import { STAGGER } from '@/shared/lib';
import { EmptyState, Skeleton } from '@/ui-kit';

import { useBuildContext } from '../../../model/context';
import { usePopularBuilds } from '../../../model/hooks';
import { PresetCard } from './components';

import s from './PresetStrip.module.scss';

const SKELETONS = [0, 1, 2];

export const PresetStrip = () => {
  const t = useTranslations('builds.presets');
  const { vehicle } = useBuildContext();
  const { data, isPending, isError } = usePopularBuilds(vehicle.tankId);
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <header className={s.head}>
        <span className={s.index}>{'// 01'}</span>
        <h2 className={s.title} id={titleId}>
          <Flame aria-hidden size={16} />
          {t('title')}
        </h2>
        <p className={s.description}>{t('description')}</p>
      </header>
      {match({ isPending, isError, count: data?.builds.length ?? 0 })
        .with({ isPending: true }, () => (
          <div className={s.grid}>
            {SKELETONS.map((key) => (
              <Skeleton key={key} height={148} />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <EmptyState code='ERR' title={t('error')} />)
        .with({ count: 0 }, () => <EmptyState title={t('empty')} />)
        .otherwise(() => (
          <motion.ol animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
            {data?.builds.map((preset) => (
              <PresetCard key={buildKey(preset)} preset={preset} source={data.source} />
            ))}
          </motion.ol>
        ))}
    </section>
  );
};
