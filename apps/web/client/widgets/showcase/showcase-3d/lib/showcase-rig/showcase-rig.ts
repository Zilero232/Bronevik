import type { Vec3 } from '@otmetki/gamedata';

import { Box3, Vector3 } from 'three';

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
  const box = world.reduce(
    (bounds, { piece, position }) => bounds.union(new Box3().setFromArray(piece.positions).translate(new Vector3(...position))),
    new Box3()
  );

  const turret = turretParts.length > 0 ? { position: turretAt, parts: turretParts } : null;

  if (box.isEmpty()) {
    return { body, turret, center: SHOWCASE_RIG.origin, radius: 1, floor: 0, height: 1 };
  }

  return {
    body,
    turret,
    center: box.getCenter(new Vector3()).toArray(),
    radius: Math.max(box.getSize(new Vector3()).length() / 2, Number.EPSILON),
    floor: box.min.y,
    height: Math.max(box.max.y - box.min.y, Number.EPSILON)
  };
};
