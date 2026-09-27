import { Mesh } from 'three';

import type { RayHit } from '../ray-layers';
import type { CollectRayHitsInput } from './scene-hits.types';

export const collectRayHits = ({ intersections, parts, direction }: CollectRayHitsInput): RayHit[] =>
  intersections.flatMap(({ object, faceIndex, face, distance }): RayHit[] => {
    const part = parts.find(({ piece }) => piece.name === object.name);

    if (!part || !(object instanceof Mesh) || faceIndex === undefined || faceIndex === null || !face) {
      return [];
    }

    const plateIndex = object.geometry.getAttribute('aPlate').getX(faceIndex * 3);
    const normal = face.normal.clone().transformDirection(object.matrixWorld);

    return [{ distance, piece: part.piece.name, kind: part.piece.kind, plate: part.plates[plateIndex], cosine: normal.dot(direction) }];
  });
