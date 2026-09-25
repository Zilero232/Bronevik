import { round } from 'remeda';

import type { EmblemPoint, LaurelLeaf, PolarInput } from './PlusEmblem.types';

import { EMBLEM } from './PlusEmblem.constants';

const polar = ({ angle, radius }: PolarInput): EmblemPoint => {
  const radians = (angle * Math.PI) / 180;

  return { x: round(EMBLEM.center + Math.cos(radians) * radius, 2), y: round(EMBLEM.center + Math.sin(radians) * radius, 2) };
};

const start = polar({ angle: EMBLEM.fromAngle, radius: EMBLEM.wreathRadius });

const end = polar({ angle: EMBLEM.toAngle, radius: EMBLEM.wreathRadius });

export const STEM_PATH = `M${start.x} ${start.y}A${EMBLEM.wreathRadius} ${EMBLEM.wreathRadius} 0 0 1 ${end.x} ${end.y}`;

export const LAUREL_LEAVES: LaurelLeaf[] = Array.from({ length: EMBLEM.leafCount }, (_, index) => {
  const progress = index / (EMBLEM.leafCount - 1);
  const angle = EMBLEM.fromAngle + (EMBLEM.toAngle - EMBLEM.fromAngle) * progress;

  return { id: index, ...polar({ angle, radius: EMBLEM.wreathRadius }), rotate: round(angle + 90, 2), scale: round(1 - progress * 0.38, 3) };
});
