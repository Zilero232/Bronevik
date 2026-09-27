'use client';

import { Grid } from '@react-three/drei';

import type { FloorGridProps } from './FloorGrid.types';

import { FLOOR_GRID, HOLOGRAM_COLORS } from '../../../../../config';

export const FloorGrid = ({ radius, shadow }: FloorGridProps) => (
  <>
    <Grid
      args={[radius * FLOOR_GRID.sizeFactor, radius * FLOOR_GRID.sizeFactor]}
      cellColor={HOLOGRAM_COLORS.grid}
      cellSize={FLOOR_GRID.cellSize}
      cellThickness={FLOOR_GRID.thickness}
      fadeDistance={radius * FLOOR_GRID.fadeFactor}
      fadeStrength={FLOOR_GRID.fadeStrength}
      sectionColor={HOLOGRAM_COLORS.gridSection}
      sectionSize={FLOOR_GRID.sectionSize}
      sectionThickness={FLOOR_GRID.sectionThickness}
    />
    <mesh material={shadow} position-y={0.01} renderOrder={1} rotation-x={-Math.PI / 2} scale={radius * FLOOR_GRID.shadowFactor}>
      <planeGeometry />
    </mesh>
  </>
);
