import type { Vec3 } from '@otmetki/gamedata';

import type { PartsOfInput, ShowcasePart, ShowcaseRig, ShowcaseRigInput, TranslateInput } from './showcase-rig.types';

import { SHOWCASE_RIG } from '../../config';

const translate = ({ point, offset }: TranslateInput): Vec3 => [point[0] + offset[0], point[1] + offset[1], point[2] + offset[2]];

const partsOf = ({ pieces, entries }: PartsOfInput): ShowcasePart[] =>
  entries.flatMap(([name, position]) => {
    const piece = name === undefined ? undefined : pieces.get(name);

    return piece ? [{ piece, position }] : [];
  });

export const showcaseRig = ({ geometry, modules }: ShowcaseRigInput): ShowcaseRig => {
  const pieces = new Map(geometry.pieces.map((piece) => [piece.name, piece]));
  const { mounts } = geometry;
  const turretModule = modules.turrets.at(-1);
  const gunModule = turretModule?.guns.at(-1);
  const turretAt = translate({ point: mounts.hull, offset: mounts.turret });

  const body = partsOf({
    pieces,
    entries: [
      [modules.chassis.at(-1)?.piece, SHOWCASE_RIG.origin],
      [modules.hull.piece, mounts.hull]
    ]
  });

  const turretParts = partsOf({
    pieces,
    entries: [
      [turretModule?.piece, SHOWCASE_RIG.origin],
      [gunModule?.piece, (turretModule && mounts.guns[turretModule.piece]) ?? SHOWCASE_RIG.origin]
    ]
  });

  const world = [...body, ...turretParts.map((part) => ({ ...part, position: translate({ point: part.position, offset: turretAt }) }))];
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
    return { body, turret, center: SHOWCASE_RIG.origin, radius: 1, floor: 0, height: 1 };
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
