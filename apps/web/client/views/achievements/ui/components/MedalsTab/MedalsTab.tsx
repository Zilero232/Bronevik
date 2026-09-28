'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, DataTable, EmptyState, QueryState, SegmentedControl, Select } from '@/ui-kit';

import { MEDAL_SORTS } from '../../../config';
import { useMedalColumns, useMedals } from '../../../model/hooks';

import s from './MedalsTab.module.scss';

export const MedalsTab = () => {
  const t = useTranslations('achievements.medals');
  const columns = useMedalColumns();
  const { query, section, sort, sections, onSectionChange, onSortChange } = useMedals();

  return (
    <div className={s.root}>
      <div className={s.toolbar}>
        <Select aria-label={t('section')} items={sections} value={section} onValueChange={onSectionChange} />
        <SegmentedControl
          aria-label={t('sort')}
          options={MEDAL_SORTS.map((value) => ({ value, label: t(`sorts.${value}`) }))}
          size='sm'
          value={sort}
          onChange={onSortChange}
        />
      </div>
      <QueryState errorTitle={t('error')} query={query} skeleton={<DataTable isLoading columns={columns} data={[]} density='media' />}>
        {(catalog) => (
          <>
            <DataTable
              caption={t('caption')}
              columns={columns}
              data={catalog.items}
              density='media'
              emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('empty')} />}
              getRowId={(row) => row.name}
              summary={t('summary', { sample: catalog.sample, total: catalog.catalogSize })}
            />
            <DataSourceNote updatedAt={catalog.computedAt} />
          </>
        )}
      </QueryState>
    </div>
  );
};
