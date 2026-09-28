import type { MapSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { listMaps } from '@/entities/map/map/api/maps/maps';
import { messages } from '@/shared/i18n';

import type { BoardSettingsPayload, BoardSettingsValues } from '../../../../lib/board-settings';

import { BOARD_SETTINGS, TACTIC_VISIBILITIES } from '../../../../config';
import { useBoardSettingsForm } from '../use-board-settings-form';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/map/map/api/maps/maps', () => ({ listMaps: vi.fn(), getMap: vi.fn() }));

const TEXT = messages.en.tactics.visibility;

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

const ENSK: MapSummary = { ...HIMMELSDORF, arenaId: '05_ensk', slug: 'ensk', name: 'Ensk', modes: ['ctf'] };

const DEFAULTS: BoardSettingsValues = { title: '  Push the first line  ', arenaId: HIMMELSDORF.arenaId, mode: 'domination', visibility: 'unlisted' };

type Submit = (payload: BoardSettingsPayload) => Promise<unknown>;

const renderForm = async (onSubmit = vi.fn<Submit>().mockResolvedValue(undefined), defaultValues = DEFAULTS) => {
  vi.mocked(listMaps).mockResolvedValue([HIMMELSDORF, ENSK]);

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  const view = renderHook(() => useBoardSettingsForm({ defaultValues, onSubmit }), { wrapper });

  await waitFor(() => expect(view.result.current.mapItems.length).toBeGreaterThan(1));

  return { onSubmit, ...view };
};

describe('useBoardSettingsForm', () => {
  it('offers every visibility with a translated label', async () => {
    const { result } = await renderForm();

    expect(result.current.visibilityItems.map(({ value }) => value)).toEqual(TACTIC_VISIBILITIES);
    expect(result.current.visibilityItems.find(({ value }) => value === 'private')?.label).toBe(TEXT.private);
    expect(result.current.visibility).toBe(DEFAULTS.visibility);
  });

  it('offers the modes of the currently chosen map', async () => {
    const { result } = await renderForm();

    expect(result.current.modeItems.map(({ value }) => value)).toEqual([BOARD_SETTINGS.none, ...HIMMELSDORF.modes]);

    act(() => result.current.onArenaChange(ENSK.arenaId));

    expect(result.current.modeItems.map(({ value }) => value)).toEqual([BOARD_SETTINGS.none, ...ENSK.modes]);
  });

  it('drops a mode the newly chosen map does not have', async () => {
    const { onSubmit, result } = await renderForm();

    act(() => result.current.onArenaChange(ENSK.arenaId));
    await act(() => result.current.onSubmit());

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Push the first line', visibility: 'unlisted', arenaId: ENSK.arenaId });
  });

  it('keeps a mode the newly chosen map also has', async () => {
    const { onSubmit, result } = await renderForm(undefined, { ...DEFAULTS, mode: 'ctf' });

    act(() => result.current.onArenaChange(ENSK.arenaId));
    await act(() => result.current.onSubmit());

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Push the first line', visibility: 'unlisted', arenaId: ENSK.arenaId, mode: 'ctf' });
  });

  it('keeps a generic mode when the map is cleared', async () => {
    const { onSubmit, result } = await renderForm();

    act(() => result.current.onArenaChange(BOARD_SETTINGS.none));
    await act(() => result.current.onSubmit());

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Push the first line', visibility: 'unlisted', mode: 'domination' });
  });

  it('leaves out the map and mode when both are unset', async () => {
    const { onSubmit, result } = await renderForm(undefined, { ...DEFAULTS, arenaId: BOARD_SETTINGS.none, mode: BOARD_SETTINGS.none });

    await act(() => result.current.onSubmit());

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Push the first line', visibility: 'unlisted' });
  });

  it('refuses an empty title without submitting', async () => {
    const { onSubmit, result } = await renderForm(undefined, { ...DEFAULTS, title: '   ' });

    await act(() => result.current.onSubmit());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.title).toBeDefined();
  });

  it('shows a server error when saving fails', async () => {
    const { result } = await renderForm(vi.fn<Submit>().mockRejectedValue(new Error('down')));

    await act(() => result.current.onSubmit());

    expect(result.current.errors.root?.server).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
  });
});
