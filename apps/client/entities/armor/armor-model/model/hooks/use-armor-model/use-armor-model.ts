'use client';

import { useQuery } from '@tanstack/react-query';

import { getArmorModel } from '../../../api';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { ARMOR_MODEL_QUERY } from '../../../config';
import { decodeArmorModel } from '../../../lib/decode-model';

export const useArmorModel = (idOrSlug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.armor(idOrSlug),
    queryFn: ({ signal }) => getArmorModel({ idOrSlug, signal }),
    select: decodeArmorModel,
    staleTime: Infinity,
    retry: (count, error) => !isNotFoundError(error) && count < ARMOR_MODEL_QUERY.maxRetries
  });
