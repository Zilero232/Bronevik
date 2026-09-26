'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DataSourceNote, DataTable, EmptyState, ErrorState, Tabs } from '@/ui-kit';

import { HOME } from '../../../config';
import { useTopPlayerColumns, useTopPlayers } from '../../../model/hooks';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('home.topPlayers');
  const tc = useTranslations('home.columns');
  const { metric, setMetric, entries, isPending, isError, retry } = useTopPlayers();
  const columns = useTopPlayerColumns(metric);

  return (
    <Card padding='none'>
      <CardHeader
        tabs={<Tabs items={HOME.topPlayers.metrics.map((value) => ({ value, label: tc(value) }))} value={metric} onValueChange={setMetric} />}
        title={t('title')}
      />
      {isError ? (
        <ErrorState isCompact onRetry={retry} />
      ) : (
        <DataTable
          columns={columns}
          data={entries}
          emptyState={<EmptyState isCompact title={t('empty')} />}
          getRowId={(entry) => `${entry.rank}-${entry.name}`}
          isLoading={isPending}
        />
      )}
      <div className={s.footer}>
        <DataSourceNote />
        <Link className={s.more} href={ROUTES.top}>
          {t('all')}
        </Link>
      </div>
    </Card>
  );
};
