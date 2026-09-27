'use client';

import type { MapStat } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { useMapLabels } from '@/entities/map/map';

import { useStatColumns, useWinRateDeltaColumn } from '../use-stat-columns';

const column = createColumnHelper<MapStat>();

export const useMapsColumns = (): TableColumn<MapStat>[] => {
  const t = useTranslations('analytics.columns');
  const labels = useMapLabels();
  const stats = useStatColumns<MapStat>();
  const winRateDelta = useWinRateDeltaColumn<MapStat>('winRateVsAverage');

  return [column.accessor((row) => labels.name(row.name), { id: 'map', header: t('map') }), ...stats, winRateDelta];
};
