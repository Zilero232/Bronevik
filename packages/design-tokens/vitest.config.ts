import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'design-tokens',
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
    environment: 'node',
    include: ['{src,scss}/**/_tests/**/*.test.ts']
  }
});
