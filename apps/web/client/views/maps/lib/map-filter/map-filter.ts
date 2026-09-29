import type { MapSummary } from '@otmetki/schemas';

import { isMapCamouflage, mapModeKind } from '@/entities/map/map';

import type { FilterMapsInput, MapSize } from './map-filter.types';

import { MAP_SIZE_BOUNDS } from '../../config';

export const normalizeMapName = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replaceAll(/[\s\-_.«»"']/g, '');

export const mapSizeClass = (sizeMeters: number | null): MapSize | null => {
  if (sizeMeters === null) {
    return null;
  }

  if (sizeMeters <= MAP_SIZE_BOUNDS.smallMax) {
    return 'small';
  }

  return sizeMeters >= MAP_SIZE_BOUNDS.largeMin ? 'large' : 'medium';
};

export const filterMaps = ({ maps, query, modes, camouflages, sizes = [], pinnedIds = null }: FilterMapsInput): MapSummary[] => {
  const needle = normalizeMapName(query);

  return maps.filter(({ arenaId, slug, name, camouflage, sizeMeters, modes: available }) => {
    const isNameMatch = needle.length === 0 || [name, arenaId, slug].some((value) => normalizeMapName(value).includes(needle));
    const isModeMatch =
      modes.length === 0 ||
      available.some((mode) => {
        const kind = mapModeKind(mode);

        return kind !== null && modes.includes(kind);
      });

    const isCamouflageMatch = camouflages.length === 0 || (isMapCamouflage(camouflage) && camouflages.includes(camouflage));
    const size = mapSizeClass(sizeMeters);
    const isSizeMatch = sizes.length === 0 || (size !== null && sizes.includes(size));
    const isPinMatch = pinnedIds === null || pinnedIds.includes(arenaId);

    return isNameMatch && isModeMatch && isCamouflageMatch && isSizeMatch && isPinMatch;
  });
};
