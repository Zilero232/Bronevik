import type { Vec3 } from '@otmetki/gamedata';

import { Ray, Triangle, Vector3 } from 'three';

import { describeHit } from '@/features/armor/armor-inspect';

import type { RayHit } from '../ray-layers';
import type { ScenePart } from '../scene-parts';
import type { CastRayInput, ZoneHits, ZoneHitsInput, ZoneReport, ZoneReportsInput } from './zone-armor.types';

import { ARMOR_ZONES } from '../../config';
import { toHitLayers } from '../ray-layers';
import { modelBounds } from '../scene-parts';

const trianglePlates = ({ piece, plates }: ScenePart): Int32Array => {
  const plateIndex = new Map(plates.map((plate, index) => [plate.name, index]));
  const result = new Int32Array(piece.indices.length / 3).fill(-1);

  for (const { plate, start, count } of piece.groups) {
    result.fill(plateIndex.get(plate) ?? -1, start / 3, (start + count) / 3);
  }

  return result;
};

const castRay = ({ parts, origin, direction }: CastRayInput): RayHit[] => {
  const ray = new Ray(new Vector3(...origin), new Vector3(...direction).normalize());
  const corners = [new Vector3(), new Vector3(), new Vector3()] as const;
  const point = new Vector3();
  const normal = new Vector3();

  return parts.flatMap((part) => {
    const { positions, indices, name, kind } = part.piece;
    const plateOf = trianglePlates(part);
    const hits: RayHit[] = [];

    for (let triangle = 0; triangle < plateOf.length; triangle += 1) {
      for (const [corner, vector] of corners.entries()) {
        const vertex = indices[triangle * 3 + corner] * 3;

        vector.set(positions[vertex] + part.position[0], positions[vertex + 1] + part.position[1], positions[vertex + 2] + part.position[2]);
      }

      if (ray.intersectTriangle(...corners, false, point)) {
        Triangle.getNormal(...corners, normal);

        hits.push({
          distance: ray.origin.distanceTo(point),
          piece: name,
          kind,
          plate: part.plates[plateOf[triangle]],
          cosine: normal.dot(ray.direction)
        });
      }
    }

    return hits;
  });
};

export const zoneHits = ({ parts }: ZoneHitsInput): ZoneHits[] => {
  const { radius } = modelBounds(parts);

  return ARMOR_ZONES.layers.flatMap((layer) => {
    const part = parts.find((item) => item.layer === layer);

    if (!part) {
      return [];
    }

    const { center } = modelBounds([part]);

    return ARMOR_ZONES.sideOrder.map((side) => {
      const [x, y, z] = ARMOR_ZONES.sides[side];
      const reach = radius * ARMOR_ZONES.originFactor;
      const origin: Vec3 = [center[0] + x * reach, center[1] + y * reach, center[2] + z * reach];

      return { layer, side, hits: castRay({ parts, origin, direction: [-x, -y, -z] }) };
    });
  });
};

export const zoneReports = ({ zones, shell, randomness, hideSpaced }: ZoneReportsInput): ZoneReport[] =>
  zones.map(({ layer, side, hits }) => ({ layer, side, report: describeHit({ layers: toHitLayers({ hits, hideSpaced }), shell, randomness }) }));
