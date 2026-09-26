'use client';

import { useQuery } from '@tanstack/react-query';

import { getArmorModel } from '@/shared/api/armor';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { decodeArmorModel } from '../../lib/decode-model';

const MAX_RETRIES = 2;

export const useArmorModel = (idOrSlug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.armor(idOrSlug),
    queryFn: ({ signal }) => getArmorModel({ idOrSlug, signal }),
    select: decodeArmorModel,
    staleTime: Infinity,
    retry: (count, error) => !isNotFoundError(error) && count < MAX_RETRIES
  });
