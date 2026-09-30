// The Gameface HUD page's protocol with core/hud/surface (packages/core): the Python test
// test_hud_backends checks the version and the command list against this file.
export const HUD_PROTOCOL = {
  version: 4,
  commands: ['ready', 'moved', 'resized', 'pressed', 'mouse'],
  mouseEvents: ['hover', 'down', 'wheel'],
  kinds: ['label', 'button'],
  widgetVersion: 1,
  tones: ['text', 'muted', 'ally', 'enemy', 'gold', 'accent', 'radio', 'track', 'stun', 'blocked', 'received', 'success', 'warning', 'good', 'bad'],
  scale: { min: 0.5, max: 3, step: 0.1 }
} as const;
