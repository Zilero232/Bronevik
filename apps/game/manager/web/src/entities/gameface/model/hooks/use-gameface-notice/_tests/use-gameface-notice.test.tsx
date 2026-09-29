import type { ReactNode } from 'react';

import { mockIPC } from '@tauri-apps/api/mocks';
import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { IntlProvider } from 'use-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useGamefaceNotice } from '@/entities/gameface';
import { COMMANDS } from '@/shared/config';
import { MESSAGES } from '@/shared/i18n';

const CLIENT_PATH = 'D:\Игры\Мир танков';

const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale='ru' messages={MESSAGES.ru}>
    {children}
  </IntlProvider>
);

const answer = (restartExpected: boolean) => {
  const asked: unknown[] = [];

  mockIPC((command, args) => {
    asked.push(args);

    if (command === COMMANDS.getGamefaceStatus) {
      return { restartExpected };
    }

    throw new Error(`unexpected ${command}`);
  });

  return asked;
};

describe('useGamefaceNotice', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns about the one restart when the manager could not prepare the res_map', async () => {
    const info = vi.spyOn(toast, 'info');
    const asked = answer(true);
    const { result } = renderHook(() => useGamefaceNotice(), { wrapper });

    await result.current(CLIENT_PATH);

    expect(info).toHaveBeenCalledWith(MESSAGES.ru.common.gamefaceRestart);
    expect(asked).toEqual([{ clientPath: CLIENT_PATH }]);
  });

  it('stays quiet when the res_map is already in place', async () => {
    const info = vi.spyOn(toast, 'info');

    answer(false);

    const { result } = renderHook(() => useGamefaceNotice(), { wrapper });

    await result.current(CLIENT_PATH);

    expect(info).not.toHaveBeenCalled();
  });
});
