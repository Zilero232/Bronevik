'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { EmptyState, ProgressBar, QueryState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { MarksSort } from '../../../lib/marks-sort';

import { MARKS } from '../../../config';
import { useMarksTab } from '../../../model/hooks';
import { MarksSummary } from '../MarksSummary';
import { ProfilePanel } from '../ProfilePanel';
import { MarkRow } from './components';

import s from './MarksTab.module.scss';

export const MarksTab = () => {
  const t = useTranslations('profile.marks');
  const format = useFormatter();
  const { query, rows, averageDamageOf, sort, setSort } = useMarksTab();

  return (
    <QueryState query={query} skeleton={<Skeleton height={MARKS.skeletonHeight} shape='block' />}>
      {({ summary }) => (
        <div className={s.root}>
          <MarksSummary counts={summary} />
          <ProgressBar
            label={t('collection')}
            max={Math.max(summary.eligible, 1)}
            size='sm'
            tone='accent'
            value={summary.moe3}
            valueLabel={t('collectionValue', { done: format.number(summary.moe3), total: format.number(summary.eligible) })}
          />
          <ProfilePanel
            isFlush
            action={
              <SegmentedControl<MarksSort>
                aria-label={t('sortLabel')}
                options={MARKS.sorts.map((value) => ({ value, label: t(`sort.${value}`) }))}
                size='sm'
                value={sort}
                onChange={setSort}
              />
            }
            title={t('progressTitle')}
          >
            {rows.length === 0 ? (
              <EmptyState isCompact title={t('empty')} />
            ) : (
              <ol className={s.list}>
                {rows.map((row) => (
                  <MarkRow key={row.vehicle.tankId} averageDamage={averageDamageOf(row.vehicle.tankId)} row={row} />
                ))}
              </ol>
            )}
          </ProfilePanel>
        </div>
      )}
    </QueryState>
  );
};
