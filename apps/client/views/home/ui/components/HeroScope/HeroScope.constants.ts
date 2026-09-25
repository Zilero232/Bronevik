export const SCOPE = {
  size: 400,
  center: 200,
  outer: 186,
  inner: 120,
  dashed: 152
} as const;

export const SCOPE_TICKS = Array.from({ length: 72 }, (_, index) => ({ angle: index * 5, isMajor: index % 6 === 0 }));

export const SCOPE_BLIPS = [
  { id: 'is7', x: 292, y: 118, label: 'ИС-7 · 4518' },
  { id: 'obj140', x: 104, y: 146, label: 'Об. 140' },
  { id: 'grille', x: 286, y: 296, label: 'Grille 15' }
] as const;
