'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { useSettingsFormatter } from '@/entities/streamer/settings';
import { getSettingsTable } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import type { SettingsFilterPreset } from './use-settings-table.types';

import { SETTINGS_FILTER_PARSERS, SETTINGS_FILTER_PRESETS, STREAMERS_SETTINGS_PAGE } from '../../../config';
import { filterSettingsRows } from '../../../lib/settings-table-filter';
import { useSettingsTableColumns } from '../use-settings-table-columns';

export const useSettingsTable = () => {
  const t = useTranslations('streamerSettings.table');
  const { optionLabel } = useSettingsFormatter();
  const [filters, setFilters] = useQueryStates(SETTINGS_FILTER_PARSERS, { history: 'replace' });
  const query = useQuery({ queryKey: QUERY_KEYS.streamers.settingsTable, queryFn: getSettingsTable });
  const columns = useSettingsTableColumns();

  const rows = filterSettingsRows({
    rows: query.data ?? [],
    query: filters.q,
    preset: filters.preset === STREAMERS_SETTINGS_PAGE.allPresets ? null : filters.preset
  });

  return {
    rows,
    columns,
    total: query.data?.length ?? 0,
    search: filters.q,
    preset: filters.preset,
    presetItems: SETTINGS_FILTER_PRESETS.map((value) => ({
      value,
      label: value === STREAMERS_SETTINGS_PAGE.allPresets ? t('allPresets') : optionLabel(value)
    })),
    isFiltered: filters.q !== '' || filters.preset !== STREAMERS_SETTINGS_PAGE.allPresets,
    isPending: query.isPending,
    isError: query.isError,
    isRetrying: query.isRefetching,
    retry: () => void query.refetch(),
    onSearch: (q: string) => void setFilters({ q: q === '' ? null : q }),
    onPreset: (preset: SettingsFilterPreset) => void setFilters({ preset }),
    onReset: () => void setFilters(null)
  };
};
