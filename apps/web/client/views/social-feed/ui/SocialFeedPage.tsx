'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, FilteredEmptyState, KeyFigure, QueryState, SegmentedControl, Skeleton } from '@/ui-kit';
import { SocialShell } from '@/widgets/social/social-shell';

import { FEED_VIEW } from '../config';
import { useSocialFeed } from '../model/hooks';
import { FeedTimeline } from './components';

import s from './SocialFeedPage.module.scss';

export const SocialFeedPage = () => {
  const t = useTranslations('social.feed');
  const { query, filters, days, isFiltered, summary, vehicles } = useSocialFeed();

  return (
    <SocialShell
      figures={
        summary && (
          <>
            <KeyFigure label={t('figures.players')} value={summary.players} variant='compact' />
            <KeyFigure label={t('figures.marks')} value={summary.marks} variant='compact' />
            <KeyFigure label={t('figures.records')} value={summary.records} variant='compact' />
          </>
        )
      }
      section='feed'
    >
      <div className={s.toolbar}>
        <SegmentedControl
          aria-label={t('filters.days')}
          options={filters.dayOptions.map((value) => ({ value, label: t('filters.dayOption', { days: Number(value) }) }))}
          size='sm'
          value={filters.days}
          onChange={filters.onDaysChange}
        />
        <SegmentedControl
          aria-label={t('filters.kind')}
          options={filters.kindOptions.map((value) => ({ value, label: t(`kinds.${value}`) }))}
          size='sm'
          value={filters.kind}
          onChange={filters.onKindChange}
        />
      </div>
      <QueryState
        empty={
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.players.list}>
                <UserPlus aria-hidden size={14} />
                {t('empty.action')}
              </Link>
            }
            description={t('empty.description')}
            title={t('empty.title')}
          />
        }
        errorDescription={t('error.description')}
        errorTitle={t('error.title')}
        isEmpty={({ items }) => items.length === 0}
        query={query}
        skeleton={<Skeleton height={FEED_VIEW.skeletonHeight} shape='block' />}
      >
        {isFiltered && days.length === 0 ? (
          <FilteredEmptyState isFiltered title={t('filteredEmpty')} onReset={() => filters.onKindChange('all')} />
        ) : (
          <FeedTimeline days={days} vehicles={vehicles} />
        )}
      </QueryState>
    </SocialShell>
  );
};
