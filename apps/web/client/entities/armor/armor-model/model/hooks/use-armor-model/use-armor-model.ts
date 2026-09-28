'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError, isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseArmorModelInput } from './use-armor-model.types';

import { getArmorModel } from '../../../api';
import { ARMOR_MODEL_REQUEST } from '../../../config';
import { decodeArmorModel } from '../../../lib/decode-model';

export const useArmorModel = ({ idOrSlug, enabled = true }: UseArmorModelInput) =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.armor(idOrSlug),
    queryFn: ({ signal }) => getArmorModel({ idOrSlug, signal }),
    select: decodeArmorModel,
    staleTime: Infinity,
    enabled,
    retry: (failureCount, error) => !isPlusRequiredError(error) && !isNotFoundError(error) && failureCount < ARMOR_MODEL_REQUEST.retryAttempts
  });
