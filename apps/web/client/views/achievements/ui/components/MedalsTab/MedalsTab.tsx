'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, DataTable, EmptyState, FilterBar, FilterField, QueryState, SegmentedControl, Select } from '@/ui-kit';

import { MEDAL_SORTS } from '../../../config';
import { useMedalColumns, useMedals } from '../../../model/hooks';

import s from './MedalsTab.module.scss';

export const MedalsTab = () => {
  const t = useTranslations('achievements.medals');
  const columns = useMedalColumns();
  const { query, section, sort, sections, onSectionChange, onSortChange } = useMedals();

  return (
    <div className={s.root}>
      <FilterBar>
        <FilterField label={t('section')} size='lg'>
          <Select aria-label={t('section')} items={sections} value={section} onValueChange={onSectionChange} />
        </FilterField>
        <FilterField label={t('sort')}>
          <SegmentedControl
            aria-label={t('sort')}
            options={MEDAL_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
            value={sort}
            onChange={onSortChange}
          />
        </FilterField>
      </FilterBar>
      <QueryState
        empty={<EmptyState description={t('emptyDescription')} title={t('empty')} />}
        errorTitle={t('error')}
        isEmpty={({ items }) => items.length === 0}
        query={query}
        skeleton={<DataTable isLoading columns={columns} data={[]} density='media' />}
      >
        {(catalog) => (
          <>
            <DataTable
              caption={t('caption')}
              columns={columns}
              data={catalog.items}
              density='media'
              getRowId={(row) => row.name}
              summary={catalog.sample > 0 ? t('summary', { sample: catalog.sample, total: catalog.catalogSize }) : undefined}
            />
            <DataSourceNote updatedAt={catalog.computedAt} />
          </>
        )}
      </QueryState>
    </div>
  );
};
