'use client';

import { Map as MapIcon, RotateCcw, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { STAGGER } from '@/shared/lib';
import { Button, EmptyState, Skeleton } from '@/ui-kit';

import type { MapGridProps } from './MapGrid.types';

import { MAPS_VIEW } from '../../../config';
import { MapCard } from '../MapCard';

import s from './MapGrid.module.scss';

export const MapGrid = ({ maps, isPending, isError, isFiltered, onRetry, onReset }: MapGridProps) => {
  const t = useTranslations('maps.grid');

  return match({ isPending, isError, count: maps.length, isFiltered })
    .with({ isPending: true }, () => (
      <div aria-busy aria-label={t('loading')} className={s.grid} role='status'>
        {Array.from({ length: MAPS_VIEW.skeletonCards }, (_, index) => (
          <Skeleton key={index} className={s.skeleton} shape='block' />
        ))}
      </div>
    ))
    .with({ isError: true }, () => (
      <EmptyState
        action={
          <Button variant='secondary' onClick={onRetry}>
            <RotateCcw size={16} />
            {t('retry')}
          </Button>
        }
        code='ERR'
        description={t('errorDescription')}
        title={t('errorTitle')}
      />
    ))
    .with({ count: 0, isFiltered: true }, () => (
      <EmptyState
        action={
          <Button variant='secondary' onClick={onReset}>
            <X size={16} />
            {t('reset')}
          </Button>
        }
        description={t('noMatchDescription')}
        icon={<MapIcon size={28} />}
        title={t('noMatchTitle')}
      />
    ))
    .with({ count: 0 }, () => <EmptyState description={t('emptyDescription')} icon={<MapIcon size={28} />} title={t('emptyTitle')} />)
    .otherwise(() => (
      <motion.ul animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
        {maps.map((map) => (
          <MapCard key={map.arenaId} map={map} />
        ))}
      </motion.ul>
    ));
};
