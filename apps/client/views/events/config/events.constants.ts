export const EVENTS = {
  kinds: ['battle_pass', 'front_line', 'onslaught', 'ranked', 'event', 'marathon', 'personal_missions', 'sale', 'drops', 'other'],
  staleMs: 10 * 60_000,
  skeletons: 3,
  dropsSkeleton: 120,
  openEndedDays: 14,
  featured: 2,
  kindTone: {
    event: 'accent',
    sale: 'success',
    marathon: 'premium',
    battle_pass: 'premium',
    front_line: 'danger',
    onslaught: 'danger',
    ranked: 'warning',
    personal_missions: 'steel',
    drops: 'accent',
    other: 'neutral'
  }
} as const;
