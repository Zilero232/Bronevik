'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable, EmptyState, FilteredEmptyState, Input, QueryState, Select } from '@/ui-kit';

import { STREAMERS_SETTINGS_PAGE } from '../../../config';
import { useSettingsTable } from '../../../model/hooks';

import s from './SettingsTable.module.scss';

export const SettingsTable = () => {
  const t = useTranslations('streamerSettings.table');
  const { query, rows, columns, search, preset, presetItems, isFiltered, onSearch, onPreset, onReset } = useSettingsTable();

  return (
    <QueryState
      empty={<EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      query={query}
      skeleton={<DataTable isLoading caption={t('caption')} columns={columns} data={[]} density='compact' />}
    >
      <DataTable
        toolbar={
          <div className={s.toolbar}>
            <Input
              aria-label={t('search')}
              icon={<Search size={STREAMERS_SETTINGS_PAGE.iconSize} />}
              placeholder={t('search')}
              size='sm'
              type='search'
              value={search}
              wrapperClassName={s.search}
              onChange={(event) => onSearch(event.target.value)}
            />
            <Select aria-label={t('preset')} items={presetItems} value={preset} onValueChange={onPreset} />
          </div>
        }
        caption={t('caption')}
        columns={columns}
        data={rows}
        density='compact'
        emptyState={<FilteredEmptyState description={t('noMatchDescription')} isFiltered={isFiltered} title={t('noMatchTitle')} onReset={onReset} />}
        getRowId={({ slug }) => slug}
        initialSorting={[...STREAMERS_SETTINGS_PAGE.initialSorting]}
      />
    </QueryState>
  );
};
