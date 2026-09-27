import { defineConfig } from 'vite';

import { buttonConfig } from './config/vite/button';
import { settingsConfig } from './config/vite/settings';
import { UI_BUILD } from './config/vite/vite.constants';

export default defineConfig(({ mode }) => (mode === UI_BUILD.buttonMode ? buttonConfig() : settingsConfig()));
