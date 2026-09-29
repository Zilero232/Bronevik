'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { mapQueries } from '../../../api';

export const useMapNameOf = () => {
  const locale = useLocale();
  const { data: maps = [] } = useQuery(mapQueries.localizedList(locale));

  const names = new Map(maps.map(({ arenaId, name }) => [arenaId, name]));

  return (arenaId: string | null) => (arenaId === null ? null : (names.get(arenaId) ?? null));
};
