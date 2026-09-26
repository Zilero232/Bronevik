import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'logger',
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
    environment: 'node',
    include: ['src/**/_tests/**/*.test.ts']
  }
});
