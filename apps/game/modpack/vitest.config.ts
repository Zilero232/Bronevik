import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'modpack-ui',
    isolate: true,
    environment: 'node',
    include: ['ui-web/**/_tests/**/*.test.ts']
  }
});
