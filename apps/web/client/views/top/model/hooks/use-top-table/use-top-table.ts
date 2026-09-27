'use client';

import { useTranslations } from 'next-intl';

import { useTopBoard } from '../use-top-board';
import { useTopColumns } from '../use-top-columns';
import { useTopTank } from '../use-top-tank';

export const useTopTable = () => {
  const t = useTranslations('top');
  const { filter, query, isRefreshing } = useTopBoard();
  const tank = useTopTank();
  const columns = useTopColumns({ filter, tank, entries: query.data?.entries ?? [] });

  const minBattles = query.data?.minBattles ?? null;

  return {
    columns,
    entries: query.data?.entries ?? [],
    tank,
    summary: minBattles === null ? undefined : t('minBattles', { count: minBattles }),
    query,
    isRefreshing
  };
};
