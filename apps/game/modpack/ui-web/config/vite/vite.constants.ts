import path from 'node:path';

const UI_WEB_ROOT = path.resolve(import.meta.dirname, '../..');

export const UI_BUILD = {
  root: UI_WEB_ROOT,
  outDir: path.resolve(UI_WEB_ROOT, '../packages/ui/gameface'),
  buttonMode: 'button',
  pages: {
    settings: path.resolve(UI_WEB_ROOT, 'index.html'),
    button: path.resolve(UI_WEB_ROOT, 'button.html')
  },
  button: {
    entry: path.resolve(UI_WEB_ROOT, 'src/button/main.tsx'),
    name: 'otmetkiButton',
    script: 'button.js',
    style: 'button'
  },
  script: {
    target: 'es2017'
  },
  style: {
    target: 'chrome58',
    pixelsPerRem: 1,
    classPrefix: 'otmetki'
  },
  icon: {
    file: 'icon.png',
    size: 48,
    radius: 8,
    stroke: 2.6,
    mark: { inset: 9, viewBox: 24 },
    tokens: { background: 'color-bg-deep', accent: 'color-accent' }
  }
} as const;
