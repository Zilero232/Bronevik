'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { TableMode } from './use-table-section.types';

import { TABLE_MODES } from '../../../config';
import { useDesignTankStats } from '../use-design-tank-stats';
import { useTankColumns } from '../use-tank-columns';

export const useTableSection = () => {
  const t = useTranslations('design.table');
  const columns = useTankColumns();
  const [mode, setMode] = useState<TableMode>('live');
  const { data, isLoading, isError, refetch } = useDesignTankStats();

  return {
    columns,
    mode,
    setMode,
    modeOptions: TABLE_MODES.map((value) => ({ value, label: t(value) })),
    rows: mode === 'live' ? (data?.items ?? []) : [],
    isError: mode === 'live' && isError,
    isLoading: mode === 'loading' || (mode === 'live' && isLoading),
    retry: () => void refetch()
  };
};
