import type { MapSummary } from '@otmetki/schemas';

import { isMapCamouflage, mapModeKind } from '@/entities/map/map';

import type { FilterMapsInput } from './map-filter.types';

export const normalizeMapName = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replaceAll(/[\s\-_.«»"']/g, '');

export const filterMaps = ({ maps, query, modes, camouflages }: FilterMapsInput): MapSummary[] => {
  const needle = normalizeMapName(query);

  return maps.filter(({ arenaId, slug, name, camouflage, modes: available }) => {
    const isNameMatch = needle.length === 0 || [name, arenaId, slug].some((value) => normalizeMapName(value).includes(needle));
    const isModeMatch =
      modes.length === 0 ||
      available.some((mode) => {
        const kind = mapModeKind(mode);

        return kind !== null && modes.includes(kind);
      });

    const isCamouflageMatch = camouflages.length === 0 || (isMapCamouflage(camouflage) && camouflages.includes(camouflage));

    return isNameMatch && isModeMatch && isCamouflageMatch;
  });
};
