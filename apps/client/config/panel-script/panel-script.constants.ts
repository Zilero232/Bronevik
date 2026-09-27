import type { BuildOptions } from 'esbuild';

import path from 'node:path';

import { CLIENT_ROOT } from '../paths';

export const PANEL_SCRIPT = {
  entry: path.resolve(CLIENT_ROOT, 'views/twitch-panel/lib/panel-script/panel-entry.ts'),
  outfile: path.resolve(CLIENT_ROOT, 'public/twitch-panel.js'),
  build: { bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, legalComments: 'none', charset: 'utf8' }
} as const satisfies { entry: string; outfile: string; build: BuildOptions };
