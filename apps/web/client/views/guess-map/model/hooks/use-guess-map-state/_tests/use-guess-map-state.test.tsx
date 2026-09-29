import type { MapSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it } from 'vitest';

import { MAP_MODE_PREFIXES } from '@/entities/map/map';
import { puzzleDay } from '@/entities/play/daily-puzzle';
import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import type { GuessMapGame, GuessMapState } from '../../../context';

import { GUESS_MAP } from '../../../../config';
import { pickDailyMap } from '../../../../lib/daily-map';
import { useGuessMapState } from '../use-guess-map-state';

const map = (index: number): MapSummary => ({
  arenaId: `${String(index).padStart(2, '0')}_map`,
  slug: `map-${index}`,
  name: `Map ${index}`,
  nameEn: null,
  image: `https://raw.githubusercontent.com/unicum-gg/wot.maps/Lesta/maps/${index}.webp`,
  sizeMeters: 1000,
  camouflage: 'summer',
  modes: [MAP_MODE_PREFIXES.standard]
});

const MAPS = Array.from({ length: 12 }, (_, index) => map(index));

const setup = () => {
  const client = new QueryClient();

  client.setQueryData(QUERY_KEYS.maps.list, MAPS);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='ru' messages={messages.ru}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useGuessMapState(), { wrapper });
};

const readyGame = (state: GuessMapState): GuessMapGame => {
  if (state.kind !== 'ready') {
    throw new Error(`expected a ready game, got ${state.kind}`);
  }

  return state.game;
};

afterEach(() => {
  window.localStorage.clear();
});

describe('useGuessMapState', () => {
  it('asks for the map of the day and starts at the closest zoom', () => {
    const { result } = setup();
    const game = readyGame(result.current);

    expect(game.target.arenaId).toBe(pickDailyMap({ maps: MAPS, day: puzzleDay(new Date()) })?.map.arenaId);
    expect(game.zoom).toBe(GUESS_MAP.zoomSteps[0]);
  });

  it('records a miss, widens the fragment and ends with a win on the right map', () => {
    const { result } = setup();
    const { target, submit } = readyGame(result.current);
    const miss = MAPS.find(({ arenaId }) => arenaId !== target.arenaId) ?? MAPS[0];

    act(() => submit(miss));

    const afterMiss = readyGame(result.current);

    expect(afterMiss.guesses.map(({ map: guessed }) => guessed.arenaId)).toEqual([miss.arenaId]);
    expect(afterMiss.zoom).toBeLessThan(GUESS_MAP.zoomSteps[0]);

    act(() => afterMiss.submit(target));

    const won = readyGame(result.current);

    expect(won.status).toBe('won');
    expect(won.zoom).toBe(1);
    expect(won.streak.wins).toBe(1);
  });

  it('ignores a map that was already guessed', () => {
    const { result } = setup();
    const { target, submit } = readyGame(result.current);
    const miss = MAPS.find(({ arenaId }) => arenaId !== target.arenaId) ?? MAPS[0];

    act(() => submit(miss));
    act(() => readyGame(result.current).submit(miss));

    expect(readyGame(result.current).guesses).toHaveLength(1);
  });
});
