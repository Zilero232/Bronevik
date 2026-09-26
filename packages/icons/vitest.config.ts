import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'icons',
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}']
  }
});
