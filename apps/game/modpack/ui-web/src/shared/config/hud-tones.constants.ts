// The HUD colour roles (docs/specs/2026-09-29-hud-visual-redesign.md section 4.4) as hex values, for SVG fills and
// inline colours: Gameface does not resolve `currentColor` reliably in inline SVG. The values are the dark theme of
// @otmetki/design-tokens; _tests/hud-tones.test.ts keeps them equal.
export const HUD_TONE_COLORS = {
  text: { token: 'color-text', hex: '#f2f2f3' },
  muted: { token: 'color-text-muted', hex: '#a3a3ad' },
  ally: { token: 'color-ally', hex: '#6fb544' },
  enemy: { token: 'color-enemy', hex: '#e07a6a' },
  gold: { token: 'color-gold', hex: '#e8b84a' },
  accent: { token: 'color-accent', hex: '#ff7a1a' },
  radio: { token: 'color-steel-blue', hex: '#80a6cc' },
  track: { token: 'color-armor', hex: '#a9b56c' },
  stun: { token: 'class-spg', hex: '#b774e0' },
  blocked: { token: 'color-steel', hex: '#8ea4b5' },
  received: { token: 'color-danger', hex: '#f1705b' },
  success: { token: 'color-success', hex: '#6fb544' },
  warning: { token: 'color-warning', hex: '#d9b23c' },
  good: { token: 'rating-good', hex: '#4cc36b' },
  bad: { token: 'rating-bad', hex: '#eb7276' }
} as const;
