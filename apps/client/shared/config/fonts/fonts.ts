import localFont from 'next/font/local';

export const fontDisplay = localFont({
  src: [
    { path: './files/tektur-latin-standard-normal.woff2', weight: '400 900', style: 'normal' },
    { path: './files/tektur-cyrillic-standard-normal.woff2', weight: '400 900', style: 'normal' }
  ],
  variable: '--font-tektur',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '75% 100%' }],
  fallback: ['Impact', 'Arial Narrow', 'sans-serif']
});

export const fontSans = localFont({
  src: [
    { path: './files/onest-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: './files/onest-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' }
  ],
  variable: '--font-onest',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});

export const fontMono = localFont({
  src: [
    { path: './files/ibm-plex-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './files/ibm-plex-mono-cyrillic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './files/ibm-plex-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './files/ibm-plex-mono-cyrillic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './files/ibm-plex-mono-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './files/ibm-plex-mono-cyrillic-600-normal.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-plex-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace']
});

export const FONT_VARIABLES = [fontDisplay.variable, fontSans.variable, fontMono.variable];
