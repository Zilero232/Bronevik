// The Gameface HUD page's protocol with core/hud/surface (packages/core): the Python test
// test_hud_backends checks the version and the command list against this file.
export const HUD_PROTOCOL = {
  version: 1,
  commands: ['ready', 'moved']
} as const;
