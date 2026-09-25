'use client';

import type { MapDetail } from '@bronevik/schemas';

import { parseAsString, useQueryState } from 'nuqs';

import { mapModes } from '../../../lib/map-modes';

export const useMapMode = (map: MapDetail) => {
  const [requested, setMode] = useQueryState('mode', parseAsString.withOptions({ history: 'replace' }));

  const modes = mapModes(map);
  const current = modes.find(({ mode }) => mode === requested) ?? modes[0] ?? null;

  return {
    mode: current?.mode ?? null,
    image: current?.minimap ?? map.image,
    available: modes.map(({ mode }) => mode),
    setMode
  };
};
