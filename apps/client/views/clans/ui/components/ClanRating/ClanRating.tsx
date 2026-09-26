'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Button, Card, CardHeader, DataTable, EmptyState, ErrorState, Select } from '@/ui-kit';

import type { ClanSort } from './ClanRating.types';

import { CLAN_SORTS } from '../../../config';
import { useClanColumns, useClanRating } from '../../../model/hooks';

import s from './ClanRating.module.scss';

export const ClanRating = () => {
  const t = useTranslations('clans.rating');
  const titleId = useId();
  const { sort, setSort, items, total, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, loadMore, retry } = useClanRating();
  const columns = useClanColumns();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader
        action={
          <Select<ClanSort>
            className={s.sort}
            items={CLAN_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
            label={t('sortLabel')}
            value={sort}
            onValueChange={(next) => void setSort(next)}
          />
        }
        title={<span id={titleId}>{t('title')}</span>}
      />
      {isError && items.length === 0 ? (
        <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
      ) : (
        <DataTable
          footer={
            items.length > 0 && (
              <>
                <span className={s.progress}>{t('shown', { shown: items.length, total })}</span>
                {hasNextPage && (
                  <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
                    {t('more')}
                  </Button>
                )}
              </>
            )
          }
          columns={columns}
          data={items}
          emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
          getRowId={(row) => String(row.clan.clanId)}
          getRowLink={({ clan }) => ({ href: ROUTES.clans.detail(clan.tag), label: clan.name })}
          isLoading={isPending}
        />
      )}
    </Card>
  );
};
