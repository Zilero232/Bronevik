import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'sdk',
    isolate: false,
    environment: 'node',
    include: ['src/**/_tests/**/*.test.ts']
  }
});
