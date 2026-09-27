import type { MapDetail, MapList } from '@otmetki/schemas';

import { mapsControllerDetail, mapsControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { MapDetailInput, MapListInput } from './maps.types';

export const listMaps = ({ signal, ...query }: MapListInput): Promise<MapList> => fromSdk(() => mapsControllerList({ query, signal }));

export const getMap = ({ signal, idOrSlug }: MapDetailInput): Promise<MapDetail> =>
  fromSdk(() => mapsControllerDetail({ path: { idOrSlug }, signal }));
