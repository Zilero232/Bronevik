'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Button, Card, CardHeader, DataTable, FilteredEmptyState, QueryState } from '@/ui-kit';

import { useGuideCatalog, useGuideColumns } from '../../../model/hooks';
import { GuideFilters } from '../GuideFilters';

import s from './GuideTable.module.scss';

export const GuideTable = () => {
  const t = useTranslations('guides.list');
  const titleId = useId();
  const { query, total, page, pages, hasPrev, hasNext, prev, next, hasFilters, reset } = useGuideCatalog();

  const columns = useGuideColumns();

  return (
    <Card aria-labelledby={titleId} className={s.root} padding='none'>
      <CardHeader meta={total > 0 ? t('total', { total }) : undefined} title={<span id={titleId}>{t('tableTitle')}</span>} />
      <QueryState
        isCompact
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<DataTable isLoading columns={columns} data={[]} toolbar={<GuideFilters />} />}
      >
        {({ items }) => (
          <DataTable
            emptyState={
              <FilteredEmptyState
                isCompact
                description={hasFilters ? t('emptyFilteredDescription') : t('emptyDescription')}
                isFiltered={hasFilters}
                resetLabel={t('filters.reset')}
                title={t('emptyTitle')}
                onReset={reset}
              />
            }
            footer={
              pages > 1 && (
                <>
                  <span className={s.progress}>{t('page', { page, pages })}</span>
                  <div className={s.pager}>
                    <Button disabled={!hasPrev} size='sm' variant='secondary' onClick={prev}>
                      {t('prev')}
                    </Button>
                    <Button disabled={!hasNext} size='sm' variant='secondary' onClick={next}>
                      {t('next')}
                    </Button>
                  </div>
                </>
              )
            }
            caption={t('tableTitle')}
            columns={columns}
            data={items}
            getRowId={(row) => row.id}
            getRowLink={(row) => ({ href: ROUTES.guides.detail(row.slug), label: row.title })}
            toolbar={<GuideFilters />}
          />
        )}
      </QueryState>
    </Card>
  );
};
