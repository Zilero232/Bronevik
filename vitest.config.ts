import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'apps/*/vitest.config.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/*/src/**', 'apps/server/src/**', 'apps/client/{entities,features,shared,ui-kit,views,widgets}/**'],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/*.d.ts', '**/index.ts', '**/generated/**', 'apps/server/src/dev/**']
    }
  }
});
