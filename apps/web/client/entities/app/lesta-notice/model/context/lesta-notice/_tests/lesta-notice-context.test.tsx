import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';

import { LestaNoticeProvider, useLestaNotice } from '@/entities/app/lesta-notice';

const renderNotice = async (isShown: boolean) => {
  const answer = Promise.resolve(isShown);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LestaNoticeProvider isShown={answer}>
      <Suspense fallback={null}>{children}</Suspense>
    </LestaNoticeProvider>
  );

  return act(async () => renderHook(() => useLestaNotice(), { wrapper }));
};

describe('useLestaNotice', () => {
  it('reports the notice on once the server answers true', async () => {
    const { result } = await renderNotice(true);

    expect(result.current).toBe(true);
  });

  it('reports the notice off once the server answers false', async () => {
    const { result } = await renderNotice(false);

    expect(result.current).toBe(false);
  });

  it('reports the notice off outside a provider', () => {
    const { result } = renderHook(() => useLestaNotice());

    expect(result.current).toBe(false);
  });
});
