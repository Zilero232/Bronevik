import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      'apps/web/*/vitest.config.ts',
      'apps/game/*/vitest.config.ts',
      'apps/game/manager/web/vitest.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'packages/*/src/**',
        'apps/web/server/src/**',
        'apps/web/client/{entities,features,shared,ui-kit,views,widgets}/**',
        'apps/game/manager/web/src/**'
      ],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/*.d.ts', '**/index.ts', '**/generated/**', 'apps/web/server/src/dev/**']
    }
  }
});
