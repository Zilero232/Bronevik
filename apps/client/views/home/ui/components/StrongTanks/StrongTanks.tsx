'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { ClassIcon, DataSourceNote, EmptyState, ErrorState, IconFilter, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useStrongTanks } from '../../../model/hooks';

import s from './StrongTanks.module.scss';

export const StrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const format = useFormatter();
  const { tiers, setTiers, cards, updatedAt, isPending, isError, retry } = useStrongTanks();

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
      {isPending && (
        <div className={s.grid}>
          {Array.from({ length: HOME.strongTanks.cards }, (_, index) => (
            <Skeleton key={index} className={s.skeleton} height={236} shape='block' />
          ))}
        </div>
      )}
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isPending && !isError && cards.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {!isPending && cards.length > 0 && (
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
      <DataSourceNote updatedAt={updatedAt} />
    </section>
  );
};
