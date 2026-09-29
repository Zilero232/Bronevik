import type { UserConfig } from 'vite';

import { defineConfig } from 'vite';

import { hudConfig } from './config/vite/hud';
import { settingsConfig } from './config/vite/settings';
import { UI_BUILD } from './config/vite/vite.constants';

const MODES: Partial<Record<string, () => UserConfig>> = { [UI_BUILD.hudMode]: hudConfig };

export default defineConfig(({ mode }) => (MODES[mode] ?? settingsConfig)());
