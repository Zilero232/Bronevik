// One stripe colour per category on the left edge of every HUD plate (docs/specs/2026-09-29-hud-visual-redesign.md
// section 4.1): damage you deal, damage you take, progress (marks, records, goals, missions), information (clock,
// consumables, equipment, traverse, hangar info). core/hud/widget RAILS lists the same names.
export const HUD_RAILS = ['damage', 'incoming', 'progress', 'info'] as const;
