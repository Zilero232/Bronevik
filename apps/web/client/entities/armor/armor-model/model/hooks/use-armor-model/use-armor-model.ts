'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getArmorModel } from '../../../api';
import { decodeArmorModel } from '../../../lib/decode-model';

export const useArmorModel = (idOrSlug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.armor(idOrSlug),
    queryFn: ({ signal }) => getArmorModel({ idOrSlug, signal }),
    select: decodeArmorModel,
    staleTime: Infinity
  });
