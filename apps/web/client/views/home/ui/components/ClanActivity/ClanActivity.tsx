'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Card, DataTable, EmptyState, QueryState, SectionHeader } from '@/ui-kit';

import { useClanActivity, useClanActivityColumns } from '../../../model/hooks';

import s from './ClanActivity.module.scss';

export const ClanActivity = () => {
  const t = useTranslations('home.clans');
  const query = useClanActivity();
  const columns = useClanActivityColumns();

  return (
    <section aria-labelledby='home-clans' className={s.root}>
      <SectionHeader id='home-clans' meta={t('period')} more={{ href: ROUTES.clans.list, label: t('all') }} title={t('title')} variant='display' />
      <Card padding='none'>
        <QueryState
          isCompact
          empty={<EmptyState isCompact title={t('empty')} />}
          query={query}
          skeleton={<DataTable isLoading columns={columns} data={[]} />}
        >
          {(rows) => (
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row) => String(row.clan.clanId)}
              getRowLink={({ clan }) => ({ href: ROUTES.clans.detail(clan.tag), label: clan.name, hasCellLink: true })}
            />
          )}
        </QueryState>
      </Card>
    </section>
  );
};
