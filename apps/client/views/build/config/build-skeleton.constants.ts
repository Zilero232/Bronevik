export const BUILD_SKELETON = {
  panels: [180, 220, 160, 200],
  statLines: Array.from({ length: 12 }, (_, index) => index),
  statRows: Array.from({ length: 10 }, (_, index) => index),
  presets: [0, 1, 2]
} as const;
