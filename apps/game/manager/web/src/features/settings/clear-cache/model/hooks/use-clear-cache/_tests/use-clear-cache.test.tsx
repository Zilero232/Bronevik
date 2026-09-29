import type { ReactNode } from 'react';

import plan from '@contract/cache-plan.json';
import cleared from '@contract/cache-result.json';
import clients from '@contract/clients.json';
import error from '@contract/error.json';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockIPC } from '@tauri-apps/api/mocks';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { IntlProvider } from 'use-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useClearCache } from '@/features/settings/clear-cache';
import { COMMANDS } from '@/shared/config';
import { MESSAGES } from '@/shared/i18n';

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}>
    <IntlProvider locale='ru' messages={MESSAGES.ru}>
      {children}
    </IntlProvider>
  </QueryClientProvider>
);

const [, reports] = plan.targets;
const afterClear = { targets: reports ? [reports] : [], totalBytes: reports?.sizeBytes ?? 0 };

describe('useClearCache', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scans again after clearing so the list shows what is left', async () => {
    let scans = 0;

    mockIPC((command) => {
      if (command === COMMANDS.listClients) {
        return clients;
      }

      if (command === COMMANDS.scanCache) {
        scans += 1;

        return scans === 1 ? plan : afterClear;
      }

      return cleared;
    });

    const { result } = renderHook(() => useClearCache(), { wrapper });

    await waitFor(() => expect(result.current.canScan).toBe(true));
    act(() => result.current.onScan());
    await waitFor(() => expect(result.current.rows).toHaveLength(2));
    act(() => result.current.onClear());
    await waitFor(() => expect(result.current.rows.map((row) => row.id)).toEqual(['game/win64/Reports']));
    expect(scans).toBe(2);
  });

  it('says why a scan failed', async () => {
    const failure = vi.spyOn(toast, 'error');

    mockIPC((command) => {
      if (command === COMMANDS.listClients) {
        return clients;
      }

      throw error;
    });

    const { result } = renderHook(() => useClearCache(), { wrapper });

    await waitFor(() => expect(result.current.canScan).toBe(true));
    act(() => result.current.onScan());
    await waitFor(() => expect(failure).toHaveBeenCalledWith(MESSAGES.ru.errors.busy, { description: MESSAGES.ru.errorHelp.busy }));
    expect(result.current.isScanned).toBe(false);
  });
});
