'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { ClassIcon, DataSourceNote, EmptyState, QueryState, SectionHeader, Skeleton, TierPicker } from '@/ui-kit';

import { HOME } from '../../../config';
import { useStrongTanks } from '../../../model/hooks';

import s from './StrongTanks.module.scss';

export const StrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const titleId = useId();
  const { tiers, setTiers, query, updatedAt } = useStrongTanks();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <SectionHeader
        action={
          <TierPicker isRequired aria-label={t('tier')} mode='single' options={HOME.strongTanks.tiers} size='sm' value={tiers} onChange={setTiers} />
        }
        id={titleId}
        meta={t('period')}
        more={{ href: ROUTES.tanks.list, label: t('all') }}
        title={t('title')}
        variant='display'
      />
      <QueryState
        isCompact
        skeleton={
          <div className={s.grid}>
            <Skeleton className={s.skeleton} count={HOME.strongTanks.cards} height={HOME.strongTanks.skeletonHeight} shape='block' />
          </div>
        }
        empty={<EmptyState isCompact isFramed title={t('empty')} />}
        query={query}
      >
        {(cards) => (
          <ul className={s.grid}>
            {cards.map(({ row, damage, battles }, index) => (
              <li key={row.vehicle.tankId} className={s.item}>
                <TankShowcaseCard
                  figures={[{ id: 'winRate', label: t('winRate'), value: <WinRateCell digits={1} value={row.winRate} /> }, damage, battles]}
                  isPriority={index === 0}
                  meta={<ClassIcon display='tag' tankClass={row.vehicle.type} variant={row.vehicle.isPremium ? 'premium' : 'regular'} />}
                  vehicle={row.vehicle}
                />
              </li>
            ))}
          </ul>
        )}
      </QueryState>
      <DataSourceNote updatedAt={updatedAt} />
    </section>
  );
};
