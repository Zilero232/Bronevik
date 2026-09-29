// The Gameface HUD page's protocol with core/hud/surface (packages/core): the Python test
// test_hud_backends checks the version and the command list against this file.
export const HUD_PROTOCOL = {
  version: 2,
  commands: ['ready', 'moved', 'resized', 'pressed'],
  kinds: ['label', 'button'],
  scale: { min: 0.5, max: 3, step: 0.1 }
} as const;
