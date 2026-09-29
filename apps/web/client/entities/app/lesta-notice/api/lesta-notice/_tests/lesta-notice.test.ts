import { connection } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { readLestaNotice } from '@/entities/app/lesta-notice/server';
import { serverEnv } from '@/shared/config/server-env/server-env';

vi.mock('server-only', () => ({}));
vi.mock('next/server', () => ({ connection: vi.fn(() => Promise.resolve()) }));
vi.mock('@/shared/config/server-env/server-env', () => ({ serverEnv: vi.fn() }));

const TOKEN = 'x'.repeat(32);

describe('readLestaNotice', () => {
  it('reads the switch at request time, after the request has started', async () => {
    vi.mocked(serverEnv).mockReturnValue({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: true });

    await expect(readLestaNotice()).resolves.toBe(true);
    expect(connection).toHaveBeenCalledOnce();
  });

  it('reports the notice off when the runtime switch is false', async () => {
    vi.mocked(serverEnv).mockReturnValue({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: false });

    await expect(readLestaNotice()).resolves.toBe(false);
  });
});
