'use client';

import { target, useHotkeys, useWindowEvent } from '@siberiacancode/reactuse';

import { isTypingTarget } from '@/shared/lib';

const WINDOW = target(() => window);

export const useCommandPaletteHotkey = (onToggle: () => void) => {
  useHotkeys(WINDOW, 'mod+k', onToggle);

  useWindowEvent('keydown', (event) => {
    if (event.key !== '/' || isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    onToggle();
  });
};
