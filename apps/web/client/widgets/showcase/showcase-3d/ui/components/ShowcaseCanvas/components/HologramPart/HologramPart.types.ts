import type { Vec3 } from '@otmetki/gamedata';
import type { BufferGeometry } from 'three';

import type { HologramMaterials } from '../../../../../lib/hologram-material';

export type HologramPartProps = {
  part: { position: Vec3; fill: BufferGeometry; edges: BufferGeometry };
  materials: HologramMaterials;
};
