import type { BuildOptions } from 'esbuild';

import path from 'node:path';

import type { BundleSpec, StyleOptions } from './build.types';

const UI_WEB_ROOT = path.resolve(import.meta.dirname, '../..');
const MODPACK_ROOT = path.resolve(UI_WEB_ROOT, '..');

export const BUILD = {
  root: UI_WEB_ROOT,
  outDir: path.resolve(MODPACK_ROOT, 'packages/ui/gameface'),
  tokensFile: path.resolve(MODPACK_ROOT, '../client/shared/styles/_tokens.scss'),
  bundles: [
    {
      entry: 'src/settings/main.tsx',
      script: 'index.js',
      style: { source: 'src/settings/styles/settings.css', output: 'index.css' },
      page: { source: 'src/settings/index.html', output: 'index.html' }
    },
    {
      entry: 'src/button/main.ts',
      script: 'button.js',
      style: { source: 'src/button/button.css', output: 'button.css' },
      page: { source: 'src/button/button.html', output: 'button.html' }
    }
  ],
  script: {
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    minify: true,
    legalComments: 'none',
    charset: 'utf8',
    jsx: 'automatic',
    jsxImportSource: 'preact'
  },
  style: { loader: 'css', minify: true, target: 'chrome58', legalComments: 'none', charset: 'utf8' }
} as const satisfies { bundles: readonly BundleSpec[]; script: BuildOptions; style: StyleOptions; root: string; outDir: string; tokensFile: string };
