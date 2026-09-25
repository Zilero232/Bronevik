export const ICON_EASE = [0.16, 1, 0.3, 1] as const;

export const DRAW = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 }
} as const;

export const STAR_STYLE = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

export const ACCENT = 'var(--bronevik-icon-accent, currentColor)';
