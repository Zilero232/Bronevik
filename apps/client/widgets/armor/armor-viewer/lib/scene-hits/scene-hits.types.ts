import type { Intersection, Vector3 } from 'three';

import type { ScenePart } from '../scene-parts';

export type CollectRayHitsInput = {
  intersections: readonly Intersection[];
  parts: readonly ScenePart[];
  direction: Vector3;
};
