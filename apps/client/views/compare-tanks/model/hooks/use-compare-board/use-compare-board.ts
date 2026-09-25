'use client';

import type { TankServerStatsRow } from '@bronevik/schemas';

import { useFormatter, useTranslations } from 'next-intl';

import { specsOfFlat, useSpecFormat } from '@/entities/tank/tank';

import type { CompareStatKey } from '../../../config';
import type { BoardSection } from './use-compare-board.types';

import { COMPARE_STATS } from '../../../config';
import { compareRow, specSections } from '../../../lib/compare-rows';
import { useComparison } from '../use-comparison';

const STAT_VALUE: Record<CompareStatKey, (row: TankServerStatsRow) => number> = {
  winRate: ({ winRate }) => winRate,
  winRateDiff: ({ winRateDiff }) => winRateDiff,
  avgDamage: ({ avgDamage }) => avgDamage,
  battles: ({ battles }) => battles
};

const STAT_FORMAT: Record<CompareStatKey, Intl.NumberFormatOptions> = {
  winRate: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  winRateDiff: { signDisplay: 'exceptZero', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  avgDamage: { maximumFractionDigits: 0 },
  battles: { notation: 'compact', maximumFractionDigits: 1 }
};

export const useCompareBoard = () => {
  const t = useTranslations('tanks.compare.board');
  const tTank = useTranslations('tank');
  const format = useFormatter();
  const spec = useSpecFormat();
  const { ids, vehicles, statsOf, isStatsLoading, isLoading, isError, refetch } = useComparison();

  const statUnit: Record<CompareStatKey, string> = { winRate: '%', winRateDiff: tTank('stats.pp'), avgDamage: '', battles: '' };

  const stats = vehicles.map(({ vehicle }) => statsOf(vehicle.tankId));

  const statsSection: BoardSection = {
    id: 'stats',
    title: t('stats'),
    isLoading: isStatsLoading,
    rows: COMPARE_STATS.map((key) => ({
      key,
      label: t(`statsKeys.${key}`),
      unit: statUnit[key],
      cells: compareRow({ key, values: stats.map((row) => (row ? STAT_VALUE[key](row) : null)) }).map((cell) => ({
        ...cell,
        display: cell.value === null ? '—' : format.number(cell.value, STAT_FORMAT[key])
      }))
    }))
  };

  const specSectionsList: BoardSection[] = specSections({ specs: vehicles.map(({ specs }) => specsOfFlat(specs)) }).map(({ group, rows }) => ({
    id: group,
    title: tTank(`specGroups.${group}`),
    isLoading: false,
    rows: rows.map(({ key, cells }) => ({
      key,
      label: spec.label(key),
      unit: spec.unit(key),
      cells: cells.map((cell) => ({ ...cell, display: spec.value({ key, value: cell.value }) }))
    }))
  }));

  return { ids, vehicles, sections: [statsSection, ...specSectionsList], isLoading, isError, refetch };
};
