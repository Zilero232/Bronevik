import type { MapSummary } from '@otmetki/schemas';

import { clamp, sortBy } from 'remeda';

import { mapModeKind } from '@/entities/map/map';
import { daySeed } from '@/entities/play/daily-puzzle';
import { seededRandom } from '@/shared/lib';

import type { DailyMap, FragmentZoomInput, MapGameStatus, MapGameStatusInput, PickDailyMapInput } from './daily-map.types';

import { GUESS_MAP } from '../../config';

export const mapPool = (maps: readonly MapSummary[]): MapSummary[] =>
  sortBy(
    maps.filter(({ image, modes }) => image !== null && modes.some((mode) => mapModeKind(mode) === GUESS_MAP.randomMode)),
    ({ arenaId }) => arenaId
  );

export const pickDailyMap = ({ maps, day }: PickDailyMapInput): DailyMap | null => {
  const pool = mapPool(maps);
  const random = seededRandom(daySeed(day));
  const map = pool[Math.floor(random() * pool.length)];
  const { min, max } = GUESS_MAP.focusRange;

  return map ? { map, focus: { x: min + random() * (max - min), y: min + random() * (max - min) } } : null;
};

export const mapGameStatus = ({ guessIds, targetId }: MapGameStatusInput): MapGameStatus => {
  if (guessIds.includes(targetId)) {
    return 'won';
  }

  return guessIds.length >= GUESS_MAP.maxGuesses ? 'lost' : 'playing';
};

export const fragmentZoom = ({ misses, isOver }: FragmentZoomInput): number =>
  isOver ? 1 : (GUESS_MAP.zoomSteps[clamp(misses, { min: 0, max: GUESS_MAP.zoomSteps.length - 1 })] ?? 1);
