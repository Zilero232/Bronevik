import type { UserConfig } from 'vite';

import { mergeConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { iconPngPlugin } from '../icon-png';
import { sharedConfig } from '../shared';
import { UI_BUILD } from '../vite.constants';

// The settings window ships as one self-contained index.html (script and styles inlined);
// button.html is the empty layout of the hangar button view. The plugin's recommended config
// turns code splitting off, which Rolldown refuses for two pages, so it is spelled out here:
// the settings page is the only one with a script, so it still builds into a single chunk.
export const settingsConfig = (): UserConfig =>
  mergeConfig(sharedConfig(), {
    base: './',
    plugins: [viteSingleFile({ useRecommendedBuildConfig: false, removeViteModuleLoader: true }), iconPngPlugin()],
    build: {
      emptyOutDir: true,
      assetsDir: '',
      assetsInlineLimit: () => true,
      rollupOptions: { input: [UI_BUILD.pages.settings, UI_BUILD.pages.button] }
    }
  });
