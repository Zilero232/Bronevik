'use client';

import type { MapSummary } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { localizedMap, mapQueries } from '@/entities/map/map';
import { activeStreak, puzzleNumber, recordResult, useDailyStorage, usePuzzleDay } from '@/entities/play/daily-puzzle';

import type { GuessMapState } from '../../context';

import { GUESS_MAP } from '../../../config';
import { fragmentZoom, mapGameStatus, mapPool, pickDailyMap } from '../../../lib/daily-map';
import { compareMaps } from '../../../lib/map-hints';

export const useGuessMapState = (): GuessMapState => {
  const locale = useLocale();
  const {
    data: maps = [],
    isLoading,
    isError,
    isFetching,
    refetch
  } = useQuery({
    ...mapQueries.list(),
    select: (list) => list.map((map) => localizedMap({ map, locale }))
  });

  const { day, refreshDay } = usePuzzleDay();
  const { guessIds, streak, setBoard, setStreak } = useDailyStorage<string>({
    day,
    storageKey: GUESS_MAP.storageKey,
    streakKey: GUESS_MAP.streakKey
  });

  const daily = day === null ? null : pickDailyMap({ maps, day });

  if (isError) {
    return { kind: 'error', isRetrying: isFetching, retry: () => void refetch() };
  }

  if (isLoading || day === null) {
    return { kind: 'loading' };
  }

  if (!daily) {
    return { kind: 'unavailable' };
  }

  const { map: target, focus } = daily;
  const pool = mapPool(maps);
  const byId = new Map(pool.map((map) => [map.arenaId, map]));
  const guesses = guessIds.flatMap((id) => {
    const map = byId.get(id);

    return map ? [{ map, hints: compareMaps({ guess: map, target }) }] : [];
  });

  const status = mapGameStatus({ guessIds, targetId: target.arenaId });

  const submit = (map: MapSummary) => {
    if (status !== 'playing' || guessIds.includes(map.arenaId)) {
      return;
    }

    const next = [...guessIds, map.arenaId];
    const nextStatus = mapGameStatus({ guessIds: next, targetId: target.arenaId });

    setBoard({ day, guessIds: next });

    if (nextStatus !== 'playing') {
      setStreak(recordResult({ streak, day, isWon: nextStatus === 'won' }));
    }
  };

  return {
    kind: 'ready',
    game: {
      number: puzzleNumber({ epoch: GUESS_MAP.epoch, day }),
      target,
      focus,
      pool,
      guesses,
      status,
      zoom: fragmentZoom({ misses: guesses.filter(({ hints }) => !hints.isCorrect).length, isOver: status !== 'playing' }),
      streak,
      currentStreak: activeStreak({ streak, today: day }),
      refreshDay,
      submit
    }
  };
};
