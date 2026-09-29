import type { MapSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { useMapNameOf } from '@/entities/map/map';
import { listMaps } from '@/entities/map/map/api/maps/maps';
import { messages } from '@/shared/i18n';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/map/map/api/maps/maps', () => ({ listMaps: vi.fn(), getMap: vi.fn() }));

const AIRFIELD: MapSummary = {
  arenaId: '101_dday',
  slug: 'dday',
  name: 'Аэродром',
  nameEn: 'Airfield',
  image: null,
  sizeMeters: 1000,
  camouflage: 'summer',
  modes: ['ctf']
};

const UNSYNCED: MapSummary = { ...AIRFIELD, arenaId: '108_normandy_nom', slug: 'normandy-nom', name: 'Одер', nameEn: null };

const renderNameOf = async (locale: 'en' | 'ru') => {
  vi.mocked(listMaps).mockResolvedValue([AIRFIELD, UNSYNCED]);

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  const view = renderHook(() => useMapNameOf(), { wrapper });

  await waitFor(() => expect(view.result.current(AIRFIELD.arenaId)).not.toBeNull());

  return view.result.current;
};

describe('useMapNameOf', () => {
  it('names a map in Russian on the Russian site', async () => {
    const nameOf = await renderNameOf('ru');

    expect(nameOf(AIRFIELD.arenaId)).toBe(AIRFIELD.name);
  });

  it('names a map in English on the English site and falls back to the stored name without one', async () => {
    const nameOf = await renderNameOf('en');

    expect(nameOf(AIRFIELD.arenaId)).toBe(AIRFIELD.nameEn);
    expect(nameOf(UNSYNCED.arenaId)).toBe(UNSYNCED.name);
  });

  it('knows nothing about an unknown or missing arena', async () => {
    const nameOf = await renderNameOf('en');

    expect(nameOf('99_unknown')).toBeNull();
    expect(nameOf(null)).toBeNull();
  });
});
