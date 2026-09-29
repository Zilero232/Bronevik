'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { localizedText } from '@/shared/lib';

import { getTankMaps } from '../../../api';
import { useTank } from '../../context';

export const useTankMaps = () => {
  const locale = useLocale();
  const { tankId } = useTank();

  const query = useQuery({
    queryKey: QUERY_KEYS.tanks.maps(tankId),
    queryFn: ({ signal }) => getTankMaps({ tankId, signal }),
    select: ({ maps, ...window }) => ({
      ...window,
      rows: maps.map(({ map, ...sample }) => ({
        ...sample,
        id: map.arenaId,
        href: ROUTES.maps.detail(map.slug),
        name: localizedText({ locale, text: map.name, english: map.nameEn })
      }))
    })
  });

  return { query };
};
