import type { UserConfig } from 'vite';

import { mergeConfig } from 'vite';

import { sharedConfig } from '../shared';
import { UI_BUILD } from '../vite.constants';

// The script features/preset_advisor injects into the client's own ammunition setup view (OpenWG Gameface's
// gf_mod_inject): no page and no React, one classic IIFE file built after the pages into the same folder.
export const advisorConfig = (): UserConfig =>
  mergeConfig(sharedConfig(), {
    build: {
      emptyOutDir: false,
      copyPublicDir: false,
      rollupOptions: {
        input: UI_BUILD.scripts.advisor.entry,
        output: { format: 'iife', entryFileNames: UI_BUILD.scripts.advisor.file, codeSplitting: false }
      }
    }
  });
