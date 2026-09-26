'use client';

import type { MapStat } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { useStatColumns, useWinRateDeltaColumn } from '../use-stat-columns';

const column = createColumnHelper<MapStat>();

export const useMapsColumns = (): ColumnDef<MapStat, never>[] => {
  const t = useTranslations('analytics.columns');
  const stats = useStatColumns<MapStat>();
  const winRateDelta = useWinRateDeltaColumn<MapStat>('winRateVsAverage');

  return [column.accessor((row) => row.name ?? row.arenaId, { id: 'map', header: t('map') }), ...stats, winRateDelta];
};
