import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { UseLinkCelebrationInput } from '../use-link-celebration.types';

import { useLinkCelebration } from '../use-link-celebration';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale='ru' messages={messages.ru}>
    {children}
  </NextIntlClientProvider>
);

const renderCelebration = (initial: UseLinkCelebrationInput) =>
  renderHook((props: UseLinkCelebrationInput) => useLinkCelebration(props), { initialProps: initial, wrapper });

describe('useLinkCelebration', () => {
  it('does not celebrate an account that was already linked on arrival', () => {
    const onLinked = vi.fn();
    const { result, rerender } = renderCelebration({ isLinked: undefined, onLinked });

    rerender({ isLinked: true, onLinked });

    expect(result.current).toBe(0);
    expect(onLinked).not.toHaveBeenCalled();
  });

  it('celebrates once when the link appears while the page is open', () => {
    const onLinked = vi.fn();
    const { result, rerender } = renderCelebration({ isLinked: false, onLinked });

    rerender({ isLinked: true, onLinked });
    rerender({ isLinked: true, onLinked });

    expect(result.current).toBe(1);
    expect(onLinked).toHaveBeenCalledTimes(1);
  });

  it('stays quiet when the account gets unlinked', () => {
    const onLinked = vi.fn();
    const { result, rerender } = renderCelebration({ isLinked: true, onLinked });

    rerender({ isLinked: false, onLinked });

    expect(result.current).toBe(0);
    expect(onLinked).not.toHaveBeenCalled();
  });

  it('celebrates again after an unlink and a fresh link', () => {
    const onLinked = vi.fn();
    const { result, rerender } = renderCelebration({ isLinked: false, onLinked });

    rerender({ isLinked: true, onLinked });
    rerender({ isLinked: false, onLinked });
    rerender({ isLinked: true, onLinked });

    expect(result.current).toBe(2);
    expect(onLinked).toHaveBeenCalledTimes(2);
  });
});
