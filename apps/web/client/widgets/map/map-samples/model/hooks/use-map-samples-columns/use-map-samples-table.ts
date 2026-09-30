'use client';

import { useFormatter } from 'next-intl';

import { PERCENT_TEXT, percentText } from '@/shared/lib';

import type { MapSampleRow } from './use-map-samples-table.types';

export const useMapSamplesTable = (rows: readonly MapSampleRow[]) => {
  const format = useFormatter();

  const lines = rows.map((row) => ({
    id: row.id,
    name: row.name,
    href: row.href,
    isEnough: row.isEnough,
    battles: format.number(row.battles),
    winRate: percentText({ format, value: row.winRate }),
    avgDamage: row.avgDamage === null ? PERCENT_TEXT.empty : format.number(row.avgDamage)
  }));

  return { lines };
};
