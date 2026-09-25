import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'schemas',
    isolate: false,
    environment: 'node',
    include: ['src/**/_tests/**/*.test.ts']
  }
});
