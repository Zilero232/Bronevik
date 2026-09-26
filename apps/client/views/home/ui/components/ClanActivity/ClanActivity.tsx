'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Card, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { useClanActivity, useClanActivityColumns } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';

import s from './ClanActivity.module.scss';

export const ClanActivity = () => {
  const t = useTranslations('home.clans');
  const { rows, isPending, isError, retry } = useClanActivity();
  const columns = useClanActivityColumns();

  return (
    <section aria-labelledby='home-clans' className={s.root}>
      <SectionTitle id='home-clans' meta={t('period')} more={{ href: ROUTES.clans.list, label: t('all') }} title={t('title')} />
      <Card padding='none'>
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
    </section>
  );
};
