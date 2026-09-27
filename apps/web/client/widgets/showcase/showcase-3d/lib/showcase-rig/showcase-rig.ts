import type { Vec3 } from '@otmetki/gamedata';

import type { ShowcasePart, ShowcaseRig, ShowcaseRigInput } from './showcase-rig.types';

const ORIGIN: Vec3 = [0, 0, 0];

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const partsOf = (pieces: ReadonlyMap<string, ShowcasePart['piece']>, entries: readonly (readonly [string | undefined, Vec3])[]): ShowcasePart[] =>
  entries.flatMap(([name, position]) => {
    const piece = name === undefined ? undefined : pieces.get(name);

    return piece ? [{ piece, position }] : [];
  });

export const showcaseRig = ({ geometry, modules }: ShowcaseRigInput): ShowcaseRig => {
  const pieces = new Map(geometry.pieces.map((piece) => [piece.name, piece]));
  const { mounts } = geometry;
  const turretModule = modules.turrets.at(-1);
  const gunModule = turretModule?.guns.at(-1);
  const turretAt = add(mounts.hull, mounts.turret);

  const body = partsOf(pieces, [
    [modules.chassis.at(-1)?.piece, ORIGIN],
    [modules.hull.piece, mounts.hull]
  ]);

  const turretParts = partsOf(pieces, [
    [turretModule?.piece, ORIGIN],
    [gunModule?.piece, (turretModule && mounts.guns[turretModule.piece]) ?? ORIGIN]
  ]);

  const world = [...body, ...turretParts.map((part) => ({ ...part, position: add(part.position, turretAt) }))];
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];

  for (const { piece, position } of world) {
    for (let index = 0; index < piece.positions.length; index += 1) {
      const axis = index % 3;
      const value = piece.positions[index] + position[axis];

      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }

  const turret = turretParts.length > 0 ? { position: turretAt, parts: turretParts } : null;

  if (!Number.isFinite(min[0])) {
    return { body, turret, center: ORIGIN, radius: 1, floor: 0, height: 1 };
  }

  return {
    body,
    turret,
    center: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2],
    radius: Math.max(Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2, Number.EPSILON),
    floor: min[1],
    height: Math.max(max[1] - min[1], Number.EPSILON)
  };
};
