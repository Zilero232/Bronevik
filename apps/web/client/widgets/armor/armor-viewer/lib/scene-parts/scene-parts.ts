import type { Vec3 } from '@otmetki/gamedata';

import { Box3, Vector3 } from 'three';

import type { ModelBounds, ScenePart, ScenePartsInput } from './scene-parts.types';

const ORIGIN: Vec3 = [0, 0, 0];

const add = (...vectors: Vec3[]): Vec3 => vectors.reduce<Vec3>((sum, [x, y, z]) => [sum[0] + x, sum[1] + y, sum[2] + z], [0, 0, 0]);

export const sceneParts = ({ geometry, modules, turret, gun, layers }: ScenePartsInput): ScenePart[] => {
  const pieces = new Map(geometry.pieces.map((piece) => [piece.name, piece]));
  const { mounts } = geometry;
  const chassis = modules.chassis.at(-1);
  const turretAt = add(mounts.hull, mounts.turret);
  const gunAt = add(turretAt, (turret && mounts.guns[turret.piece]) ?? ORIGIN);

  const candidates = [
    { layer: 'chassis', module: chassis, position: ORIGIN },
    { layer: 'hull', module: modules.hull, position: mounts.hull },
    { layer: 'turret', module: turret, position: turretAt },
    { layer: 'gun', module: gun, position: gunAt }
  ] as const;

  return candidates.flatMap(({ layer, module, position }) => {
    const piece = module && pieces.get(module.piece);

    return piece && layers.includes(layer) ? [{ layer, piece, plates: module.plates, position }] : [];
  });
};

export const modelBounds = (parts: readonly ScenePart[]): ModelBounds => {
  const box = parts.reduce(
    (bounds, { piece, position }) => bounds.union(new Box3().setFromArray(piece.positions).translate(new Vector3(...position))),
    new Box3()
  );

  if (box.isEmpty()) {
    return { center: ORIGIN, radius: 1 };
  }

  return { center: box.getCenter(new Vector3()).toArray(), radius: Math.max(box.getSize(new Vector3()).length() / 2, Number.EPSILON) };
};
