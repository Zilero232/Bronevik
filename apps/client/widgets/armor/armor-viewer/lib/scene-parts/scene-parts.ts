import type { Vec3 } from '@bronevik/gamedata';

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
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];

  for (const { piece, position } of parts) {
    for (let index = 0; index < piece.positions.length; index += 1) {
      const axis = index % 3;
      const value = piece.positions[index] + position[axis];

      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }

  if (!Number.isFinite(min[0])) {
    return { center: ORIGIN, radius: 1 };
  }

  const center: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];

  return { center, radius: Math.max(Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2, Number.EPSILON) };
};
