import { unique } from 'remeda';

import type { ReplayModeOptionsInput } from './replay-modes.types';

export const replayModeOptions = ({ maps, arenaId, hidden }: ReplayModeOptionsInput): string[] => {
  const selected = arenaId === null ? null : maps.find((map) => map.arenaId === arenaId);
  const source = selected ? [selected] : maps;
  const excluded = new Set(hidden);

  return unique(source.flatMap((map) => map.modes))
    .filter((mode) => mode.length > 0 && !excluded.has(mode))
    .sort();
};
