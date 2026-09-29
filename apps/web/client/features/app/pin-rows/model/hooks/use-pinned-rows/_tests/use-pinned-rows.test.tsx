import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { usePinnedRows } from '@/features/app/pin-rows';
import { STORAGE_KEYS } from '@/shared/constants';

const PendingProbe = () => {
  const { isPending } = usePinnedRows({ scope: 'tanks', isPinnedOnly: true });

  return <output>{String(isPending)}</output>;
};

afterEach(() => {
  window.localStorage.clear();
});

describe('usePinnedRows', () => {
  it('reports the pinned-only view as pending in the server render', () => {
    expect(renderToString(<PendingProbe />)).toContain('true');
  });

  it('reads the stored pins in the browser', () => {
    window.localStorage.setItem(STORAGE_KEYS.pinnedTanks, JSON.stringify(['7']));

    const { result } = renderHook(() => usePinnedRows({ scope: 'tanks', isPinnedOnly: true }));

    expect(result.current).toEqual({ isPending: false, filterIds: ['7'], rowIds: ['7'] });
  });
});
