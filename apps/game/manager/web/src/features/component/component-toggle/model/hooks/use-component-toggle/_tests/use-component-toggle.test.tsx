import type { ReactNode } from 'react';

import installation from '@contract/installation.json';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockIPC } from '@tauri-apps/api/mocks';
import { act, renderHook, waitFor } from '@testing-library/react';
import { IntlProvider } from 'use-intl';
import { describe, expect, it } from 'vitest';

import { useComponentToggle } from '@/features/component/component-toggle';
import { COMMANDS, QUERY_KEYS } from '@/shared/config';
import { MESSAGES } from '@/shared/i18n';

const CLIENT = 'D:\\Игры\\Мир танков';

const setup = () => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale='ru' messages={MESSAGES.ru}>
        {children}
      </IntlProvider>
    </QueryClientProvider>
  );

  return { queryClient, wrapper };
};

describe('useComponentToggle', () => {
  it('sends the switch to the Rust core and stores the installation it returns', async () => {
    const calls: unknown[] = [];

    mockIPC((command, args) => {
      calls.push({ command, args });

      return installation;
    });

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(() => useComponentToggle({ clientPath: CLIENT, componentId: 'hit_log', title: 'Лог попаданий' }), { wrapper });

    act(() => result.current.onCheckedChange(false));

    await waitFor(() => expect(queryClient.getQueryData(QUERY_KEYS.installation(CLIENT))).toEqual(installation));
    expect(calls).toEqual([{ command: COMMANDS.setComponentEnabled, args: { clientPath: CLIENT, componentId: 'hit_log', enabled: false } }]);
  });

  it('leaves the cached installation alone when the game is running', async () => {
    mockIPC(() => {
      // eslint-disable-next-line no-throw-literal -- Tauri rejects an invoke with the command's serialised error object, not an Error
      throw { code: 'client_running', message: 'the game is running' };
    });

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(() => useComponentToggle({ clientPath: CLIENT, componentId: 'hit_log', title: 'Лог попаданий' }), { wrapper });

    act(() => result.current.onCheckedChange(true));

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(queryClient.getQueryData(QUERY_KEYS.installation(CLIENT))).toBeUndefined();
  });
});
