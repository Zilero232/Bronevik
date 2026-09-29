'use client';

import { useTranslations } from 'next-intl';

import { Band, EmptyState, QueryState } from '@/ui-kit';

import { useMarksPage } from '../model/hooks';
import { ClosestMarks, ForecastLink, MarksHead, MarksTable, MarksToolbar, MoeDrawer } from './components';

import s from './MarksPage.module.scss';

export const MarksPage = () => {
  const t = useTranslations('marks.table');
  const tCommon = useTranslations('common');
  const { rows, pinnedIds, total, updatedAt, isUntracked, query, selected, isDrawerOpen, onSelect, onDrawerChange } = useMarksPage();

  return (
    <div className={s.root}>
      <MarksHead isEmpty={isUntracked} isLoading={query.isPending} total={total} updatedAt={updatedAt} />
      <Band as='div' innerClassName={s.bandInner}>
        <ClosestMarks />
        <aside className={s.rail}>
          <ForecastLink />
        </aside>
      </Band>
      <section aria-label={t('title')} className={s.main}>
        <MarksToolbar />
        <QueryState
          empty={<EmptyState description={t('untrackedHint')} title={t('untracked')} />}
          errorTitle={t('error')}
          isEmpty={() => isUntracked}
          query={query}
          skeleton={<MarksTable isLoading rows={rows} onSelect={onSelect} />}
        >
          <MarksTable isStale={query.isPlaceholderData} pinnedRowIds={pinnedIds} rows={rows} onSelect={onSelect} />
        </QueryState>
        <p className={s.source}>{tCommon('dataSource')}</p>
      </section>
      <MoeDrawer isOpen={isDrawerOpen} row={selected} onOpenChange={onDrawerChange} />
    </div>
  );
};
