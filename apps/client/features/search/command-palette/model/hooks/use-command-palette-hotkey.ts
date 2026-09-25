'use client';

import { target, useHotkeys, useWindowEvent } from '@siberiacancode/reactuse';

const WINDOW = target(() => window);

const TYPING_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

const isTyping = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || TYPING_TAGS.includes(target.tagName));

export const useCommandPaletteHotkey = (onToggle: () => void) => {
  useHotkeys(WINDOW, 'mod+k', onToggle);

  useWindowEvent('keydown', (event) => {
    if (event.key !== '/' || isTyping(event.target)) {
      return;
    }

    event.preventDefault();
    onToggle();
  });
};
