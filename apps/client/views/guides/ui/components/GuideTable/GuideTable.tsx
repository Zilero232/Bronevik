'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Button, Card, CardHeader, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { useGuideCatalog, useGuideColumns } from '../../../model/hooks';
import { GuideFilters } from '../GuideFilters';

import s from './GuideTable.module.scss';

export const GuideTable = () => {
  const t = useTranslations('guides.list');
  const titleId = useId();
  const { items, total, page, pages, hasPrev, hasNext, prev, next, hasFilters, reset, isPending, isError, isRetrying, retry } = useGuideCatalog();

  const columns = useGuideColumns();

  return (
    <Card aria-labelledby={titleId} className={s.root} padding='none'>
      <CardHeader meta={total > 0 ? t('total', { total }) : undefined} title={<span id={titleId}>{t('tableTitle')}</span>} />
      {isError ? (
        <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
      ) : (
        <DataTable
          emptyState={
            <EmptyState
              isCompact
              action={
                hasFilters && (
                  <Button size='sm' variant='secondary' onClick={reset}>
                    {t('filters.reset')}
                  </Button>
                )
              }
              description={hasFilters ? t('emptyFilteredDescription') : t('emptyDescription')}
              title={t('emptyTitle')}
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
          columns={columns}
          data={items}
          getRowId={(row) => row.id}
          getRowLink={(row) => ({ href: ROUTES.guides.detail(row.slug), label: row.title })}
          isLoading={isPending}
          toolbar={<GuideFilters />}
        />
      )}
    </Card>
  );
};
