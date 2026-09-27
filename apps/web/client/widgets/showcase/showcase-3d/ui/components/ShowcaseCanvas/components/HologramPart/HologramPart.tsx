'use client';

import type { HologramPartProps } from './HologramPart.types';

export const HologramPart = ({ part, materials }: HologramPartProps) => (
  <group position={part.position}>
    <mesh geometry={part.fill} material={materials.fill} />
    <lineSegments geometry={part.edges} material={materials.edge} />
  </group>
);
