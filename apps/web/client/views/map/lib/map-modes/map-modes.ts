import type { MapDetail } from '@otmetki/schemas';

import { MAP_MODE_KINDS, mapModeKind } from '@/entities/map/map';

import type { MapModeView } from './map-modes.types';

const rank = (mode: string) => {
  const kind = mapModeKind(mode);

  return kind ? MAP_MODE_KINDS.indexOf(kind) : MAP_MODE_KINDS.length;
};

export const mapModes = (map: Pick<MapDetail, 'gameModes' | 'modes'>): MapModeView[] => {
  const modes: MapModeView[] = map.gameModes.length > 0 ? map.gameModes : map.modes.map((mode) => ({ mode, minimap: null }));

  return [...modes].sort((a, b) => rank(a.mode) - rank(b.mode));
};
