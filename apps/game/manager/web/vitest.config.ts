import { resolve } from 'node:path';
import { defineProject, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

// The manager's UI suites run on its own Vite config (React, the @ alias, SCSS modules) in jsdom.
// Tauri IPC is replaced per test with @tauri-apps/api/mocks.
export default mergeConfig(
  viteConfig,
  defineProject({
    test: {
      name: 'manager',
      pool: 'vmThreads',
      clearMocks: true,
      restoreMocks: true,
      environment: 'jsdom',
      setupFiles: [resolve(import.meta.dirname, 'vitest.setup.ts')],
      include: ['src/**/_tests/**/*.test.{ts,tsx}'],
      css: { modules: { classNameStrategy: 'non-scoped' } }
    }
  })
);
