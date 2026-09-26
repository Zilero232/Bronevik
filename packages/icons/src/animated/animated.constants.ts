export const ICON_EASE = [0.16, 1, 0.3, 1] as const;

export const DRAW = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 }
} as const;

export const STAR_STYLE = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

export const ACCENT = 'var(--otmetki-icon-accent, currentColor)';

export const LOGO_MARK_STYLE = `
.otmetki-logo-mark-bar { stroke-dasharray: 1; stroke-dashoffset: 0; animation: otmetki-logo-mark-draw 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
.otmetki-logo-mark-bar:last-of-type { animation-name: otmetki-logo-mark-draw, otmetki-logo-mark-flash; animation-duration: 0.42s, 0.9s; }
@keyframes otmetki-logo-mark-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes otmetki-logo-mark-flash { from { stroke: var(--otmetki-icon-accent, currentColor); } to { stroke: currentColor; } }
@media (prefers-reduced-motion: reduce) { .otmetki-logo-mark-bar { animation: none; } }
`;
