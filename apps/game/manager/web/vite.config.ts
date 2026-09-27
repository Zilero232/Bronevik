import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The UI lives in web/ and the Rust app in ../tauri: Tauri serves this dev server on a fixed port and
// bundles web/dist (tauri/tauri.conf.json). `@contract` is the JSON the Rust tests write for the UI's
// contract tests. WebView2 on Windows 10/11 is Chromium, so the bundle targets a recent Chrome; the app loads
// its single bundle from disk, so the web chunk-size warning does not apply.
export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  resolve: {
    alias: {
      '@contract': resolve(import.meta.dirname, '../tauri/contract'),
      '@': resolve(import.meta.dirname, 'src')
    }
  },
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ['**/tauri/**'] }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome110',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1024
  }
});
