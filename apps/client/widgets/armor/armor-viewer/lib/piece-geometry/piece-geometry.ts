import { BufferAttribute, BufferGeometry } from 'three';

import type { PieceBuffers } from '@/entities/armor/armor-model';

export const toBufferGeometry = ({ positions, normals, thickness, flags, plate }: PieceBuffers): BufferGeometry => {
  const geometry = new BufferGeometry();

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new BufferAttribute(normals, 3));
  geometry.setAttribute('aThickness', new BufferAttribute(thickness, 1));
  geometry.setAttribute('aFlags', new BufferAttribute(flags, 1));
  geometry.setAttribute('aPlate', new BufferAttribute(plate, 1));
  geometry.computeBoundingSphere();

  return geometry;
};
