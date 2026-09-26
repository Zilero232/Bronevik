'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState, ErrorState, Input, Select } from '@/ui-kit';

import { STREAMERS_SETTINGS_PAGE } from '../../../config';
import { useSettingsTable } from '../../../model/hooks';

import s from './SettingsTable.module.scss';

export const SettingsTable = () => {
  const t = useTranslations('streamerSettings.table');
  const { rows, columns, total, search, preset, presetItems, isFiltered, isPending, isError, isRetrying, retry, onSearch, onPreset, onReset } =
    useSettingsTable();

  return (
    <DataTable
      emptyState={
        isError ? (
          <ErrorState isRetrying={isRetrying} onRetry={retry} />
        ) : (
          <EmptyState
            action={
              isFiltered && (
                <Button size='sm' variant='secondary' onClick={onReset}>
                  {t('reset')}
                </Button>
              )
            }
            description={total === 0 ? t('emptyDescription') : t('noMatchDescription')}
            title={total === 0 ? t('emptyTitle') : t('noMatchTitle')}
          />
        )
      }
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
      getRowId={({ slug }) => slug}
      initialSorting={[...STREAMERS_SETTINGS_PAGE.initialSorting]}
      isLoading={isPending}
    />
  );
};
