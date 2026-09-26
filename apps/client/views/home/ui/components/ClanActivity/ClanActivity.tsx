'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { useClanActivity, useClanActivityColumns } from '../../../model/hooks';

import s from './ClanActivity.module.scss';

export const ClanActivity = () => {
  const t = useTranslations('home.clans');
  const { rows, isPending, isError, retry } = useClanActivity();
  const columns = useClanActivityColumns();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <Link className={s.more} href={ROUTES.clans}>
            {t('all')}
          </Link>
        }
        meta={t('period')}
        title={t('title')}
      />
      {isError ? (
        <ErrorState isCompact onRetry={retry} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          emptyState={<EmptyState isCompact title={t('empty')} />}
          getRowId={(row) => String(row.clan.clanId)}
          isLoading={isPending}
        />
      )}
    </Card>
  );
};
