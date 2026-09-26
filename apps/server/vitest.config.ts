import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: {
    decorator: { legacy: true, emitDecoratorMetadata: true }
  },
  test: {
    name: 'server',
    isolate: false,
    environment: 'node',
    server: { deps: { inline: ['vitest-mock-extended'] } },
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
