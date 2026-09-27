import type { ThreeEvent } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';

import type { ScenePart } from '../../../../../lib/scene-parts';

export type ArmorPieceMeshProps = {
  part: ScenePart;
  material: ShaderMaterial;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut: () => void;
};
