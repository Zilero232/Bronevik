import type { UserConfig } from 'vite';

import { mergeConfig } from 'vite';

import { sharedConfig } from '../shared';
import { UI_BUILD } from '../vite.constants';

// The hangar button is injected into a game view by gf_mod_inject, which loads a script and
// a stylesheet by path, so it builds as one IIFE plus its own button.css next to the page.
export const buttonConfig = (): UserConfig =>
  mergeConfig(sharedConfig(), {
    build: {
      emptyOutDir: false,
      copyPublicDir: false,
      lib: {
        entry: UI_BUILD.button.entry,
        name: UI_BUILD.button.name,
        formats: ['iife'],
        fileName: () => UI_BUILD.button.script,
        cssFileName: UI_BUILD.button.style
      }
    }
  });
