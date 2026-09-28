import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'client',
    isolate: true,
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom',
    globals: true,
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      NEXT_PUBLIC_SITE_URL: 'https://triotmetki.ru',
      NEXT_PUBLIC_APP_VERSION: '0.0.0-test'
    },
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    server: { deps: { inline: ['next-intl'] } }
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname),
      '@otmetki/icons': resolve(import.meta.dirname, '../../../packages/icons/src')
    }
  }
});
