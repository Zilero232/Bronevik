import type { MapSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { listMaps } from '@/entities/map/map/api/maps/maps';
import { messages } from '@/shared/i18n';

import { BOARD_SETTINGS } from '../../../../config';
import { useTacticMaps } from '../use-tactic-maps';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/map/map/api/maps/maps', () => ({ listMaps: vi.fn(), getMap: vi.fn() }));

const TEXT = messages.en;

const HIMMELSDORF: MapSummary = {
  arenaId: '04_himmelsdorf',
  slug: 'himmelsdorf',
  nameEn: null,
  name: 'Himmelsdorf',
  image: null,
  sizeMeters: 700,
  camouflage: 'summer',
  modes: ['ctf', 'domination']
};

const PROVING_GROUND: MapSummary = { ...HIMMELSDORF, arenaId: '99_proving', slug: 'proving', name: 'Proving Ground', modes: [] };

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

const renderLoaded = async () => {
  vi.mocked(listMaps).mockResolvedValue([HIMMELSDORF, PROVING_GROUND]);
  const view = renderHook(() => useTacticMaps(), { wrapper: createWrapper() });

  await waitFor(() => expect(view.result.current.isPending).toBe(false));

  return view;
};

describe('useTacticMaps', () => {
  it('offers only the empty choice while maps are loading', () => {
    vi.mocked(listMaps).mockReturnValue(new Promise(() => undefined));
    const { result } = renderHook(() => useTacticMaps(), { wrapper: createWrapper() });

    expect(result.current.isPending).toBe(true);
    expect(result.current.mapItems).toEqual([{ value: BOARD_SETTINGS.none, label: TEXT.tactics.settings.none }]);
  });

  it('lists the loaded maps after the empty choice', async () => {
    const { result } = await renderLoaded();

    expect(result.current.mapItems.map(({ value }) => value)).toEqual([BOARD_SETTINGS.none, HIMMELSDORF.arenaId, PROVING_GROUND.arenaId]);
    expect(result.current.mapItems[1]?.label).toBe(HIMMELSDORF.name);
  });

  it('offers the modes of the chosen map with readable labels', async () => {
    const { result } = await renderLoaded();

    expect(result.current.modeItems(HIMMELSDORF.arenaId)).toEqual([
      { value: BOARD_SETTINGS.none, label: TEXT.tactics.settings.none },
      { value: 'ctf', label: TEXT.maps.modes.standard },
      { value: 'domination', label: TEXT.maps.modes.encounter }
    ]);
  });

  it('falls back to every mode when the map is unknown, unset or has no modes', async () => {
    const { result } = await renderLoaded();
    const fallback = [BOARD_SETTINGS.none, ...BOARD_SETTINGS.fallbackModes];

    expect(result.current.modeItems(null).map(({ value }) => value)).toEqual(fallback);
    expect(result.current.modeItems('missing').map(({ value }) => value)).toEqual(fallback);
    expect(result.current.modeItems(PROVING_GROUND.arenaId).map(({ value }) => value)).toEqual(fallback);
  });

  it('finds a loaded map by its arena id', async () => {
    const { result } = await renderLoaded();

    expect(result.current.mapOf(HIMMELSDORF.arenaId)).toEqual(HIMMELSDORF);
    expect(result.current.mapOf('missing')).toBeNull();
    expect(result.current.mapOf(null)).toBeNull();
  });
});
