import { round } from 'remeda';

import type { LaurelInput, LaurelPointInput, LaurelSideInput, LeafInput } from '../icon';

const LEAF = {
  length: 3.9,
  width: 1.35,
  tilt: 0.5,
  first: 30,
  last: 146,
  stemStart: 18
} as const;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const fixed = (value: number) => round(value, 2);

const at = ({ cx, cy, radius, flip, angle }: LaurelPointInput) => ({
  x: cx - flip * radius * Math.sin(angle),
  y: cy + radius * Math.cos(angle)
});

const leafPath = ({ angle, lean, ...branch }: LeafInput) => {
  const base = at({ ...branch, angle });
  const tangent = { x: -branch.flip * Math.cos(angle), y: -Math.sin(angle) };
  const outward = { x: -branch.flip * Math.sin(angle), y: Math.cos(angle) };
  const dir = {
    x: tangent.x * Math.cos(lean) + outward.x * Math.sin(lean),
    y: tangent.y * Math.cos(lean) + outward.y * Math.sin(lean)
  };

  const tip = { x: base.x + dir.x * LEAF.length, y: base.y + dir.y * LEAF.length };
  const mid = { x: (base.x + tip.x) / 2, y: (base.y + tip.y) / 2 };
  const normal = { x: -dir.y * LEAF.width, y: dir.x * LEAF.width };

  return `M${fixed(base.x)} ${fixed(base.y)}Q${fixed(mid.x + normal.x)} ${fixed(mid.y + normal.y)} ${fixed(tip.x)} ${fixed(tip.y)}Q${fixed(mid.x - normal.x)} ${fixed(mid.y - normal.y)} ${fixed(base.x)} ${fixed(base.y)}Z`;
};

const branch = ({ leaves, ...input }: LaurelSideInput) => {
  const count = Math.max(1, Math.floor(leaves));
  const span = count > 1 ? (LEAF.last - LEAF.first) / (count - 1) : 0;
  const start = at({ ...input, angle: toRadians(LEAF.stemStart) });
  const end = at({ ...input, angle: toRadians(LEAF.last) });
  const sweep = input.flip === 1 ? 1 : 0;

  return {
    stem: `M${fixed(start.x)} ${fixed(start.y)}A${input.radius} ${input.radius} 0 0 ${sweep} ${fixed(end.x)} ${fixed(end.y)}`,
    leaves: Array.from({ length: count }, (_, index) =>
      leafPath({ ...input, angle: toRadians(LEAF.first + span * index), lean: index % 2 === 0 ? LEAF.tilt : -LEAF.tilt })
    )
  };
};

export const laurelBranches = (input: LaurelInput) => ({
  left: branch({ ...input, flip: 1 }),
  right: branch({ ...input, flip: -1 })
});
