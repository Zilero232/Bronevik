export const COLOR_SWATCHES = [
  {
    group: 'surfaces',
    tokens: ['--color-bg-deep', '--color-bg', '--color-surface-sunken', '--color-surface', '--color-surface-raised', '--color-border-strong']
  },
  { group: 'accents', tokens: ['--color-accent-hover', '--color-accent', '--color-steel', '--color-border-strong'] },
  { group: 'signals', tokens: ['--color-success', '--color-warning', '--color-danger', '--color-text', '--color-text-muted', '--color-text-dim'] }
] as const;

export const TYPE_SAMPLES = [
  { key: 'display', className: 'display' },
  { key: 'heading', className: 'heading' },
  { key: 'body', className: 'body' },
  { key: 'mono', className: 'mono' },
  { key: 'numbers', className: 'numbers' }
] as const;

export const SPACING_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
