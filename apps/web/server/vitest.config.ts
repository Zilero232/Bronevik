import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: {
    decorator: { legacy: true, emitDecoratorMetadata: true }
  },
  test: {
    name: 'server',
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
    environment: 'node',
    // Bun's isolated linker gives vitest-mock-extended its own copy of vitest (a
    // different peer set), whose chai plugin then replaces the runner's toThrow and
    // every `rejects.toThrow` fails with "reading 'indexOf'". Inlining it lets Vite
    // resolve its `vitest` import to the runner's instance.
    server: { deps: { inline: ['vitest-mock-extended'] } },
    // Headroom for the first test of a file that pulls a large module graph while
    // every project runs in parallel (the import-cycle test alone takes ~15s of CPU).
    testTimeout: 15_000,
    hookTimeout: 15_000,
    include: ['src/**/_tests/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5434/test',
      DIRECT_URL: 'postgresql://test:test@localhost:5434/test',
      REDIS_URL: 'redis://localhost:6380',
      API_URL: 'http://localhost:4000',
      WEB_URL: 'http://localhost:3000',
      BETTER_AUTH_SECRET: 'test-secret-not-used-outside-tests-000',
      MOD_INGEST_SECRET: 'test-mod-ingest-secret',
      LESTA_APPLICATION_ID: 'test-application'
    }
  }
});
