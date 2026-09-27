export const COLOR_SWATCHES = [
  {
    group: 'surfaces',
    tokens: [
      '--color-band',
      '--color-bg',
      '--color-band-raised',
      '--color-surface-sunken',
      '--color-surface',
      '--color-surface-raised',
      '--color-surface-overlay',
      '--color-border-strong'
    ]
  },
  { group: 'accents', tokens: ['--color-accent-hover', '--color-accent', '--color-accent-pressed', '--color-steel', '--color-premium'] },
  { group: 'classes', tokens: ['--class-lt', '--class-mt', '--class-ht', '--class-td', '--class-spg', '--class-aspg'] },
  { group: 'tiers', tokens: ['--tier-low', '--tier-mid', '--tier-high', '--tier-top'] },
  {
    group: 'equipment',
    tokens: ['--equip-standard', '--equip-trophy', '--equip-bonds', '--equip-experimental', '--equip-consumable', '--equip-directive']
  },
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
