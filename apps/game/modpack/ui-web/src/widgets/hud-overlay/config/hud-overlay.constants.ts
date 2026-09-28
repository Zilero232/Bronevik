export const HUD_OVERLAY = {
  // One page pixel per design pixel until Gameface reports its root font size (it scales the page
  // through it; every length is rem, 1rem = 1px of the design).
  fallbackScale: 1,
  grid: 1,
  unit: 'rem',
  centered: '50%',
  translate: { x: 'translateX(-50%)', y: 'translateY(-50%)', both: 'translate(-50%, -50%)' }
} as const;
