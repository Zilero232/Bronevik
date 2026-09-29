'use client';

import { TANK_CLASSES, TIERS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, DataTable, FilteredEmptyState, IconFilter, QueryState, SegmentedControl } from '@/ui-kit';

import { TANK_RARITY_SORTS } from '../../../config';
import { useTankRarity, useTankRarityColumns } from '../../../model/hooks';

import s from './TankRarityTab.module.scss';

export const TankRarityTab = () => {
  const t = useTranslations('achievements.tanks');
  const columns = useTankRarityColumns();
  const { query, tiers, types, order, isFiltered, onReset, onTiersChange, onTypesChange, onOrderChange } = useTankRarity();

  return (
    <div className={s.root}>
      <div className={s.toolbar}>
        <IconFilter aria-label={t('tier')} kind='tier' options={TIERS} size='sm' value={tiers} onChange={onTiersChange} />
        <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} size='sm' value={types} onChange={onTypesChange} />
        <SegmentedControl
          aria-label={t('sort')}
          options={TANK_RARITY_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
          size='sm'
          value={order}
          onChange={onOrderChange}
        />
      </div>
      <QueryState errorTitle={t('error')} query={query} skeleton={<DataTable isLoading columns={columns} data={[]} density='media' />}>
        {(rarity) => (
          <>
            <DataTable
              emptyState={
                <FilteredEmptyState isCompact description={t('emptyDescription')} isFiltered={isFiltered} title={t('empty')} onReset={onReset} />
              }
              caption={t('caption')}
              columns={columns}
              data={rarity.items}
              density='media'
              getRowId={(row) => String(row.vehicle.tankId)}
              getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
              summary={rarity.sample > 0 ? t('summary', { sample: rarity.sample }) : undefined}
            />
            <DataSourceNote updatedAt={rarity.computedAt} />
          </>
        )}
      </QueryState>
    </div>
  );
};
