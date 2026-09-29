'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseArmorGunsInput } from './use-armor-guns.types';

import { getArmorGuns } from '../../../api';

export const useArmorGuns = ({ idOrSlug }: UseArmorGunsInput) =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.armorGuns(idOrSlug ?? ''),
    queryFn: ({ signal }) => getArmorGuns({ idOrSlug: idOrSlug ?? '', signal }),
    staleTime: Infinity,
    enabled: Boolean(idOrSlug)
  });
