'use client';

import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DataSourceNote, DataTable, EmptyState, ErrorState, Tabs } from '@/ui-kit';

import { HOME } from '../../../config';
import { useStrongTankColumns, useStrongTanks } from '../../../model/hooks';

import s from './StrongTanks.module.scss';

export const StrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const { tier, setTier, rows, updatedAt, isPending, isError, retry } = useStrongTanks();
  const columns = useStrongTankColumns();

  return (
    <Card padding='none'>
      <CardHeader
        tabs={<Tabs items={HOME.strongTanks.tiers.map((value) => ({ value, label: toRoman(Number(value)) }))} value={tier} onValueChange={setTier} />}
        title={t('title')}
      />
      {isError ? (
        <ErrorState isCompact onRetry={retry} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          density='media'
          emptyState={<EmptyState isCompact title={t('empty')} />}
          getRowId={(row) => String(row.vehicle.tankId)}
          isLoading={isPending}
        />
      )}
      <div className={s.footer}>
        <DataSourceNote updatedAt={updatedAt} />
        <Link className={s.more} href={ROUTES.tanks}>
          {t('all')}
        </Link>
      </div>
    </Card>
  );
};
