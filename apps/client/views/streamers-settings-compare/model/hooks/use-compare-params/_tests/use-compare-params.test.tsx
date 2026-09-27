import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { useCompareParams } from '../use-compare-params';

const renderParams = (searchParams: string) => renderHook(() => useCompareParams(), { wrapper: withNuqsTestingAdapter({ searchParams }) });

describe('useCompareParams', () => {
  it('reads unique slugs from the slots', () => {
    const { result } = renderParams('?a=Jove&b=jove&c=near-you&me=true');

    expect(result.current).toMatchObject({ slugs: ['jove', 'near-you'], isMine: true });
  });

  it('packs slugs back into the slots', async () => {
    const { result } = renderParams('?a=jove');

    await act(async () => result.current.setSlugs(['jove', 'near-you']));

    expect(result.current.slugs).toEqual(['jove', 'near-you']);
  });

  it('toggles the own column', async () => {
    const { result } = renderParams('');

    await act(async () => result.current.onMineChange(true));

    expect(result.current.isMine).toBe(true);

    await act(async () => result.current.onMineChange(false));

    expect(result.current.isMine).toBe(false);
  });
});
