'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { localizedMapDetail } from '@/entities/map/map';

import { mapQueries } from '../../../api';

export const useMapDetail = (idOrSlug: string) => {
  const locale = useLocale();

  return useQuery({ ...mapQueries.detail(idOrSlug), retry: false, select: (map) => localizedMapDetail({ map, locale }) });
};
