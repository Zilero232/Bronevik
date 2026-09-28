import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLocationHash } from '@/shared/lib';
import { useModProfilePage } from '@/views/mod-profile/model/hooks';

vi.mock('@/shared/lib', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/shared/lib')>()), useLocationHash: vi.fn() }));

const CODE = 'TM1.eJyrVkrLz1eyUkpKLFKqBQApfgT-';

const renderWithHash = (hash: string | null) => {
  vi.mocked(useLocationHash).mockReturnValue(hash);

  return renderHook(() => useModProfilePage()).result.current;
};

describe('useModProfilePage', () => {
  it('waits for the browser before it reads the fragment', () => {
    expect(renderWithHash(null)).toEqual({ status: 'pending' });
  });

  it('offers the code from the fragment', () => {
    expect(renderWithHash(CODE)).toEqual({ status: 'ready', code: CODE });
  });

  it('reports a link without a profile code as missing', () => {
    expect(renderWithHash('')).toEqual({ status: 'missing' });
    expect(renderWithHash('not-a-code')).toEqual({ status: 'missing' });
  });
});
