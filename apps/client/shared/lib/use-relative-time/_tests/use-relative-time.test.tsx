import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FORMATS } from '@/shared/i18n';

import { useRelativeTime } from '../use-relative-time';

const NOW = new Date('2026-09-25T12:00:00Z');

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider formats={FORMATS} locale='en' messages={{}} timeZone='UTC'>
    {children}
  </NextIntlClientProvider>
);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useRelativeTime', () => {
  it('describes a past moment relative to now', () => {
    const { result } = renderHook(() => useRelativeTime('2026-09-25T10:00:00Z'), { wrapper });

    expect(result.current?.text).toBe('2 hours ago');
    expect(result.current?.iso).toContain('2026-09-25');
  });

  it('returns nothing for a missing or broken value', () => {
    expect(renderHook(() => useRelativeTime(null), { wrapper }).result.current).toBeNull();
    expect(renderHook(() => useRelativeTime('not a date'), { wrapper }).result.current).toBeNull();
  });
});
