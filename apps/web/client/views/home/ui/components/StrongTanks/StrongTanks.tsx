'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { ClassIcon, DataSourceNote, EmptyState, IconFilter, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useStrongTanks } from '../../../model/hooks';

import s from './StrongTanks.module.scss';

export const StrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const format = useFormatter();
  const { tiers, setTiers, query, updatedAt } = useStrongTanks();

  return (
    <section aria-labelledby='home-strong-tanks' className={s.root}>
      <SectionHeader
        action={
          <IconFilter
            aria-label={t('tier')}
            isMultiple={false}
            kind='tier'
            options={HOME.strongTanks.tiers}
            size='sm'
            value={tiers}
            onChange={setTiers}
          />
        }
        id='home-strong-tanks'
        meta={t('period')}
        more={{ href: ROUTES.tanks.list, label: t('all') }}
        title={t('title')}
        variant='display'
      />
      <QueryState
        isCompact
        skeleton={
          <div className={s.grid}>
            <Skeleton className={s.skeleton} count={HOME.strongTanks.cards} height={236} shape='block' />
          </div>
        }
        empty={<EmptyState isCompact title={t('empty')} />}
        query={query}
      >
        {(cards) => (
          <ul className={s.grid}>
            {cards.map((row, index) => (
              <li key={row.vehicle.tankId} className={s.item}>
                <TankShowcaseCard
                  figures={[
                    { id: 'winRate', label: t('winRate'), value: <WinRateCell digits={1} value={row.winRate} /> },
                    { id: 'damage', label: t('damage'), value: format.number(row.avgDamage, { maximumFractionDigits: 0 }) },
                    { id: 'battles', label: t('battles'), value: format.number(row.battles, { notation: 'compact', maximumFractionDigits: 1 }) }
                  ]}
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
