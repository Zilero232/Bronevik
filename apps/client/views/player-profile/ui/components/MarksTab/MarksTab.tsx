'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SegmentedControl, Skeleton } from '@/ui-kit';

import type { MarksSort } from '../../../lib/marks-sort';

import { sortMarks } from '../../../lib/marks-sort';
import { usePlayerMarks, usePlayerTanks } from '../../../model/hooks';
import { TabState } from '../TabState';
import { MarkRow, MarksSummary } from './components';

import s from './MarksTab.module.scss';

const SORTS: readonly MarksSort[] = ['closest', 'percent', 'battles'];

export const MarksTab = () => {
  const t = useTranslations('profile.marks');
  const { data: marks, isPending, isError } = usePlayerMarks();
  const { data: tanks } = usePlayerTanks();

  const [sort, setSort] = useState<MarksSort>('closest');

  const averages = new Map(tanks?.items.map(({ vehicle, avgDamage }) => [vehicle.tankId, avgDamage]));

  if (isError) {
    return <TabState kind='error' />;
  }

  if (isPending) {
    return <Skeleton height={480} shape='block' />;
  }

  const rows = sortMarks({ rows: marks.items, sort });

  return (
    <div className={s.root}>
      <MarksSummary summary={marks.summary} />
      <div className={s.toolbar}>
        <h3 className={s.title}>{t('progressTitle')}</h3>
        <SegmentedControl<MarksSort>
          aria-label={t('sortLabel')}
          options={SORTS.map((value) => ({ value, label: t(`sort.${value}`) }))}
          size='sm'
          value={sort}
          onChange={setSort}
        />
      </div>
      {rows.length === 0 ? (
        <TabState kind='empty' />
      ) : (
        <ol className={s.list}>
          {rows.map((row, index) => (
            <MarkRow key={row.vehicle.tankId} averageDamage={averages.get(row.vehicle.tankId) ?? null} index={index} row={row} />
          ))}
        </ol>
      )}
    </div>
  );
};
