export const CELEBRATE = {
  colors: ['#ff7a1a', '#ff8f3d', '#e3ad4f', '#c9a44f', '#f2f2f3'],
  storagePrefix: 'otmetki-celebrate:',
  zIndex: 1000,
  bursts: [
    { particleCount: 70, angle: 60, spread: 55, origin: { x: 0, y: 0.75 } },
    { particleCount: 70, angle: 120, spread: 55, origin: { x: 1, y: 0.75 } }
  ]
} as const;
