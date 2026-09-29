export const GUESS_MAP = {
  maxGuesses: 6,
  storageKey: 'otmetki-guess-map',
  streakKey: 'otmetki-guess-map:streak',
  epoch: '2026-09-29',
  randomMode: 'standard',
  zoomSteps: [4, 3.2, 2.5, 1.9, 1.45, 1.15],
  focusRange: { min: 0.25, max: 0.75 },
  imageSizes: '(max-width: 640px) 100vw, 480px',
  searchIcon: 16,
  skeletonChoices: 12
} as const;

export const GUESS_MAP_SHARE = {
  hit: '+',
  miss: 'x'
} as const;

export const MAP_HINT_TONE = {
  camouflage: { match: 'success', miss: 'danger', unknown: 'neutral' },
  size: { match: 'success', larger: 'warning', smaller: 'warning', unknown: 'neutral' }
} as const;
