import type { Usage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useUsageMeter } from '@/entities/plus/usage';
import { getUsage } from '@/entities/plus/usage/api/usage/usage';

vi.mock('@/entities/plus/usage/api/usage/usage', () => ({ getUsage: vi.fn() }));

const RESETS_AT = '2026-09-30T21:00:00.000Z';

const usageOf = (overrides: Partial<Usage>): Usage => ({
  audience: 'free',
  resetsAt: RESETS_AT,
  meters: [{ meter: 'armor3d', feature: 'armor3d', limit: 15, used: 15, remaining: 0 }],
  ...overrides
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{children}</QueryClientProvider>
);

describe('useUsageMeter', () => {
  it('reports a used-up meter as exhausted', async () => {
    vi.mocked(getUsage).mockResolvedValue(usageOf({}));

    const { result } = renderHook(() => useUsageMeter({ meter: 'armor3d' }), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current).toMatchObject({ isExhausted: true, isUnlimited: false, resetsAt: RESETS_AT });
  });

  it('reports an unlimited meter as never exhausted', async () => {
    vi.mocked(getUsage).mockResolvedValue(
      usageOf({ audience: 'plus', meters: [{ meter: 'armor3d', feature: 'armor3d', limit: null, used: 0, remaining: null }] })
    );

    const { result } = renderHook(() => useUsageMeter({ meter: 'armor3d' }), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current).toMatchObject({ isExhausted: false, isUnlimited: true });
  });

  it('does not ask the server while disabled', () => {
    vi.mocked(getUsage).mockClear();

    const { result } = renderHook(() => useUsageMeter({ meter: 'armor3d', enabled: false }), { wrapper });

    expect(getUsage).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });
});
