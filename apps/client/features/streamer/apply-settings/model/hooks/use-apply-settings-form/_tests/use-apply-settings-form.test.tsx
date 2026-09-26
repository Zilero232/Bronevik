import type { ApplyRequest, StreamerSettings } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';
import { FORMATS, messages } from '@/shared/i18n';

import { requestSettingsApply } from '../../../../api';
import { useApplySettingsForm } from '../use-apply-settings-form';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ requestSettingsApply: vi.fn() }));

const SLUG = 'jove';
const TEXT = messages.en.streamerSettings;
const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };
const PROVENANCE = { source: 'creator', sourceUrl: null, checkedAt: '2026-09-26T10:00:00.000Z' } as const;

const SETTINGS: StreamerSettings = {
  display: { resolution: '1920x1080', preset: 'medium', ...PROVENANCE },
  controls: { sensitivity: { sniper: 0.3 }, ...PROVENANCE },
  hardware: { gpu: 'RTX 3060', ...PROVENANCE }
};

const HARDWARE_ONLY: StreamerSettings = { hardware: { gpu: 'RTX 3060', ...PROVENANCE } };

const REQUEST: ApplyRequest = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: SLUG,
  groups: ['controls'],
  status: 'pending',
  createdAt: '2026-09-26T10:00:00.000Z',
  appliedAt: null
};

const setup = (settings: StreamerSettings) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, SESSION);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider formats={FORMATS} locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, ...renderHook(() => useApplySettingsForm({ slug: SLUG, settings }), { wrapper }) };
};

describe('useApplySettingsForm', () => {
  it('is unavailable when the streamer has no applicable settings', () => {
    const { result } = setup(HARDWARE_ONLY);

    expect(result.current.isAvailable).toBe(false);
    expect(result.current.groupOptions).toEqual([]);
  });

  it('offers each applicable group with its translated label', () => {
    const { result } = setup(SETTINGS);

    expect(result.current.isAvailable).toBe(true);
    expect(result.current.isSignedIn).toBe(true);

    expect(result.current.groupOptions).toEqual([
      { value: 'display', label: TEXT.groups.display },
      { value: 'controls', label: TEXT.groups.controls }
    ]);
  });

  it('refuses to submit without a picked group', async () => {
    const { result } = setup(SETTINGS);

    await act(() => result.current.onSubmit());

    expect(result.current.form.getFieldState('groups').invalid).toBe(true);
    expect(requestSettingsApply).not.toHaveBeenCalled();
  });

  it('offers the hardware opt-ins only for the picked groups', () => {
    const { result } = setup(SETTINGS);

    act(() => result.current.form.setValue('groups', ['controls']));

    expect(result.current.options).toEqual({ hasResolution: false, hasSensitivity: true });
  });

  it('drops an opt-in the picked groups do not offer and refreshes the request list', async () => {
    vi.mocked(requestSettingsApply).mockResolvedValue(REQUEST);
    const { client, result } = setup(SETTINGS);

    client.setQueryData(QUERY_KEYS.me.streamer.applyRequests, []);

    act(() => {
      result.current.form.setValue('groups', ['controls']);
      result.current.form.setValue('includeResolution', true);
      result.current.form.setValue('includeSensitivity', true);
    });

    await act(() => result.current.onSubmit());

    await waitFor(() => expect(result.current.request).toEqual(REQUEST));

    expect(requestSettingsApply).toHaveBeenCalledWith(
      { slug: SLUG, groups: ['controls'], includeResolution: false, includeSensitivity: true },
      expect.anything()
    );

    expect(client.getQueryState(QUERY_KEYS.me.streamer.applyRequests)?.isInvalidated).toBe(true);
  });

  it('forgets the picked groups and the sent request when closed', async () => {
    vi.mocked(requestSettingsApply).mockResolvedValue(REQUEST);
    const { result } = setup(SETTINGS);

    act(() => result.current.onOpenChange(true));
    act(() => result.current.form.setValue('groups', ['display']));
    await act(() => result.current.onSubmit());
    await waitFor(() => expect(result.current.request).toEqual(REQUEST));

    act(() => result.current.onOpenChange(false));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.request).toBeNull();
    expect(result.current.form.getValues('groups')).toEqual([]);
  });

  it('reports a failed request', async () => {
    vi.mocked(requestSettingsApply).mockRejectedValue(new Error('down'));
    const { result } = setup(SETTINGS);

    act(() => result.current.form.setValue('groups', ['display']));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.apply.failed));
    expect(result.current.request).toBeNull();
  });
});
