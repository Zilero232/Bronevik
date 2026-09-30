export const WHEEL_SCROLL_PROPS = { 'data-wheel-scroll': '' } as const;

export const SCROLL_AREA = {
  attribute: 'data-wheel-scroll',
  scrollable: ['auto', 'scroll'],
  step: 72,
  minThumb: 28,
  measureMs: 250
} as const;
