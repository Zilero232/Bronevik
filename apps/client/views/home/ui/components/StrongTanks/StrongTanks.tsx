'use client';

import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useStrongTanks } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';
import { ShowcaseCard } from './components';

import s from './StrongTanks.module.scss';

export const StrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const { tier, setTier, cards, updatedAt, isPending, isError, retry } = useStrongTanks();

  return (
    <section aria-labelledby='home-strong-tanks' className={s.root}>
      <SectionTitle
        aside={
          <SegmentedControl
            aria-label={t('tier')}
            options={HOME.strongTanks.tiers.map((value) => ({ value, label: toRoman(Number(value)) }))}
            size='sm'
            value={tier}
            onChange={setTier}
          />
        }
        id='home-strong-tanks'
        meta={t('period')}
        more={{ href: ROUTES.tanks.list, label: t('all') }}
        title={t('title')}
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
              <ShowcaseCard isPriority={index === 0} row={row} />
            </li>
          ))}
        </ul>
      )}
      <DataSourceNote updatedAt={updatedAt} />
    </section>
  );
};
