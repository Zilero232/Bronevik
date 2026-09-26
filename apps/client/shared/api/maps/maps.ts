import type { MapDetail, MapList } from '@otmetki/schemas';

import type { MapDetailInput, MapListInput } from './maps.types';

import { mapsControllerDetail, mapsControllerList } from '../generated';
import { fromSdk } from '../source';

export const listMaps = ({ signal, ...query }: MapListInput): Promise<MapList> => fromSdk(() => mapsControllerList({ query, signal }));

export const getMap = ({ signal, idOrSlug }: MapDetailInput): Promise<MapDetail> =>
  fromSdk(() => mapsControllerDetail({ path: { idOrSlug }, signal }));
