import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { MapQueue, MapRotation, MapRotationRow, QueueCell } from '../../../../api';

import { getMapQueue, getMapRotation } from '../../../../api';
import { MAP_STATS } from '../../../../config';
import { useQueueNow } from '../use-queue-now';

vi.mock('../../../../api', () => ({ getMapQueue: vi.fn(), getMapRotation: vi.fn() }));

const cell = (tier: number, medianSec: number): QueueCell => ({ tier, hour: 20, samples: 50, avgSec: medianSec, medianSec, p90Sec: medianSec * 2 });

const SELECTED = cell(0, 30);

const QUEUE: MapQueue = {
  tier: 0,
  mode: 'random',
  timezone: 'Europe/Moscow',
  windowDays: 14,
  minSamples: 20,
  cells: [],
  now: { hour: 20, selected: SELECTED, fastest: cell(8, 12), tiers: [cell(8, 12), cell(10, 45)] },
  computedAt: '2026-09-27T12:00:00.000Z'
};

const row = (index: number): MapRotationRow => ({
  arenaId: `arena-${index}`,
  name: `Map ${index}`,
  slug: null,
  image: null,
  camouflageType: null,
  battles: 100 - index,
  share: 10,
  modBattles: 0,
  replayBattles: 0
});

const ROTATION: MapRotation = {
  tier: 0,
  mode: 'random',
  windowDays: 14,
  battles: 1_000,
  rows: Array.from({ length: MAP_STATS.compactTopMaps + 2 }, (_, index) => row(index)),
  computedAt: null
};

const renderQueueNow = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useQueueNow(), { wrapper });
};

beforeEach(() => {
  vi.mocked(getMapQueue).mockReset().mockResolvedValue(QUEUE);
  vi.mocked(getMapRotation).mockReset().mockResolvedValue(ROTATION);
});

describe('useQueueNow', () => {
  it('has no data while the queue loads', () => {
    vi.mocked(getMapQueue).mockReturnValue(new Promise(() => undefined));

    const { result } = renderQueueNow();

    expect(result.current.query.data).toBeUndefined();
    expect(result.current.now).toBeNull();
    expect(result.current.timezone).toBeNull();
  });

  it('measures every tier against the overall wait and keeps only the top maps', async () => {
    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.data?.topMaps).toHaveLength(MAP_STATS.compactTopMaps));

    expect(result.current.query.data?.overall).toEqual(SELECTED);

    expect(result.current.query.data?.tiers.map(({ tier, deltaSec }) => [tier, deltaSec])).toEqual([
      [8, 12 - 30],
      [10, 45 - 30]
    ]);

    expect(result.current.query.data?.topMaps.map(({ arenaId }) => arenaId)).toEqual(
      ROTATION.rows.slice(0, MAP_STATS.compactTopMaps).map(({ arenaId }) => arenaId)
    );

    expect(result.current.timezone).toBe('Europe/Moscow');
  });

  it('shows no delta when there is no overall wait for this hour', async () => {
    vi.mocked(getMapQueue).mockResolvedValue({ ...QUEUE, now: { ...QUEUE.now, selected: null } });

    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.data).toBeDefined());
    expect(result.current.query.data?.tiers.map(({ deltaSec }) => deltaSec)).toEqual([null, null]);
  });

  it('still shows the queue when only the rotation fails', async () => {
    vi.mocked(getMapRotation).mockRejectedValue(new Error('down'));

    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.isRefetching).toBe(false));
    await waitFor(() => expect(result.current.query.data?.overall).toEqual(SELECTED));
    expect(result.current.query.data?.topMaps).toEqual([]);
    expect(result.current.query.isError).toBe(false);
  });

  it('still shows the top maps when only the queue fails', async () => {
    vi.mocked(getMapQueue).mockRejectedValue(new Error('down'));

    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.data?.topMaps).toHaveLength(MAP_STATS.compactTopMaps));
    expect(result.current.query.data?.overall).toBeNull();
    expect(result.current.query.data?.tiers).toEqual([]);
    expect(result.current.query.isError).toBe(false);
  });

  it('fails only when both requests fail and retries both', async () => {
    vi.mocked(getMapQueue).mockRejectedValue(new Error('down'));
    vi.mocked(getMapRotation).mockRejectedValue(new Error('down'));

    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.isError).toBe(true));
    expect(result.current.query.data).toBeUndefined();

    act(() => result.current.query.refetch());

    await waitFor(() => expect(getMapQueue).toHaveBeenCalledTimes(2));
    expect(getMapRotation).toHaveBeenCalledTimes(2);
  });

  it('formats a wait in whole seconds', async () => {
    const { result } = renderQueueNow();

    await waitFor(() => expect(result.current.query.data).toBeDefined());
    expect(result.current.formatWait(29.6)).toBe('30 sec');
  });
});
