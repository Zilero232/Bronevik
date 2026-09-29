'use client';

import { TANK_CLASSES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import {
  DataSourceNote,
  DataTable,
  FilterBar,
  FilteredEmptyState,
  FilterField,
  IconFilter,
  QueryState,
  SegmentedControl,
  TierPicker
} from '@/ui-kit';

import { TANK_RARITY_SORTS } from '../../../config';
import { useTankRarity, useTankRarityColumns } from '../../../model/hooks';

import s from './TankRarityTab.module.scss';

export const TankRarityTab = () => {
  const t = useTranslations('achievements.tanks');
  const columns = useTankRarityColumns();
  const { query, tiers, types, order, isFiltered, activeCount, onReset, onTiersChange, onTypesChange, onOrderChange } = useTankRarity();

  return (
    <div className={s.root}>
      <FilterBar activeCount={activeCount} onReset={onReset}>
        <FilterField count={tiers.length} label={t('tier')}>
          <TierPicker aria-label={t('tier')} mode='single' value={tiers} onChange={onTiersChange} />
        </FilterField>
        <FilterField count={types.length} label={t('type')}>
          <IconFilter aria-label={t('type')} kind='class' options={TANK_CLASSES} value={types} onChange={onTypesChange} />
        </FilterField>
        <FilterField label={t('sort')}>
          <SegmentedControl
            aria-label={t('sort')}
            options={TANK_RARITY_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
            value={order}
            onChange={onOrderChange}
          />
        </FilterField>
      </FilterBar>
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
