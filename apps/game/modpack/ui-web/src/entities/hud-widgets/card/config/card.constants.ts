// The `card` plate (core/hud/widget): icon sizes in design px and the glyph of each row status.
export const CARD = {
  statuses: ['active', 'done', 'honors', 'failed', 'idle'],
  headerIcon: 16,
  rowIcon: 14,
  chipIcon: 16,
  status: {
    active: { icon: 'otmetki:dot', tone: 'accent' },
    done: { icon: 'otmetki:check', tone: 'success' },
    honors: { icon: 'otmetki:check_double', tone: 'gold' },
    failed: { icon: 'otmetki:cross', tone: 'bad' },
    idle: { icon: 'otmetki:dot', tone: 'muted' }
  }
} as const;
