import type {
  ArmorChassisModule,
  ArmorFlag,
  ArmorGunModule,
  ArmorPieceGeometry,
  ArmorPlate,
  ArmorShellOption,
  ArmorTurretModule
} from '@bronevik/gamedata';

import { armorFlags, armorPieceKind } from '@bronevik/gamedata';
import { unique } from 'remeda';

import type {
  GunModuleInput,
  IsOneOfInput,
  JoinArmorModelInput,
  JoinedArmorModel,
  PiecePlatesInput,
  ResolvePieceInput,
  ShellOptionInput,
  WeldedMesh,
  WeldInput
} from './join.types';

import { ARMOR_JOIN, DEFAULT_PIECES } from './join.constants';

const isOneOf = ({ values, value }: IsOneOfInput): boolean => values.includes(value);

export const weldVertices = ({ positions, indices }: WeldInput): WeldedMesh => {
  const ids = new Map<string, number>();
  const welded: number[] = [];
  const remap = new Uint32Array(positions.length / 3);

  for (let vertex = 0; vertex < remap.length; vertex += 1) {
    const point = positions.slice(vertex * 3, vertex * 3 + 3);
    const key = point.join(',');
    let id = ids.get(key);

    if (id === undefined) {
      id = ids.size;
      ids.set(key, id);
      welded.push(...point);
    }

    remap[vertex] = id;
  }

  return { positions: Float32Array.from(welded), indices: Uint32Array.from(indices, (index) => remap[index]) };
};

const toShellOption = ({ shot, shellNames }: ShellOptionInput): ArmorShellOption => ({
  name: shot.shell,
  displayName: (shot.shellId === undefined ? undefined : shellNames?.get(shot.shellId)) ?? shot.shell,
  kind: shot.kind ?? 'ARMOR_PIERCING',
  caliber: shot.caliber ?? 0,
  damage: shot.damage?.armor ?? 0,
  penetration: shot.piercingPower,
  isPremium: shot.isPremium ?? false
});

export const joinArmorModel = ({ spec, collision, shellNames }: JoinArmorModelInput): JoinedArmorModel => {
  const mismatches: string[] = [];

  const pieces = Object.entries(collision.parts).flatMap(([name, part]): ArmorPieceGeometry[] => {
    const kind = armorPieceKind(name);

    if (!kind) {
      mismatches.push(`${spec.tag}: unknown collision piece ${name}`);

      return [];
    }

    return [
      {
        name,
        kind,
        ...weldVertices({ positions: part.positions, indices: part.indices }),
        groups: part.groups.map(({ name: plate, start, count }) => ({ plate, start, count }))
      }
    ];
  });

  const resolvePiece = ({ declared, kind, index }: ResolvePieceInput): string | undefined => {
    if (declared && pieces.some((piece) => piece.name === declared)) {
      return declared;
    }

    if (declared) {
      mismatches.push(`${spec.tag}: ${declared} is not in the collision model`);
    }

    const candidates = pieces.filter((piece) => piece.kind === kind).map((piece) => piece.name);

    return candidates[index] ?? candidates[0];
  };

  const platesOf = ({ piece, kind, armor, spaced }: PiecePlatesInput): ArmorPlate[] => {
    const plates = unique(pieces.find((item) => item.name === piece)?.groups.map((group) => group.plate) ?? []);
    const mirrorArmor = collision.armor[piece] ?? {};
    const mirrorSpaced = collision.spaced[piece] ?? [];

    return plates.map((name) => {
      const isModule = isOneOf({ values: ARMOR_JOIN.modulePlates, value: name });
      const own = armor[name];
      const mirror = mirrorArmor[name];
      const isSpaced = spaced.includes(name);

      if (own === undefined && !isModule) {
        mismatches.push(`${spec.tag} ${piece}.${name}: no thickness in the vehicle XML`);
      }

      if (own !== undefined && mirror !== undefined && Math.abs(own - mirror) > ARMOR_JOIN.thicknessTolerance) {
        mismatches.push(`${spec.tag} ${piece}.${name}: XML ${own} mm, mirror ${mirror} mm`);
      }

      if (mirror !== undefined && isSpaced !== mirrorSpaced.includes(name)) {
        mismatches.push(`${spec.tag} ${piece}.${name}: spaced in ${isSpaced ? 'XML' : 'mirror'} only`);
      }

      const thickness = own ?? 0;

      const flags: ArmorFlag[] = [
        ...(isSpaced ? (['spaced'] as const) : []),
        ...(kind === 'chassis' || isOneOf({ values: ARMOR_JOIN.trackPlates, value: name }) ? (['track'] as const) : []),
        ...(kind === 'gun' ? (['gun'] as const) : []),
        ...(isModule ? (['module'] as const) : []),
        ...(thickness <= 0 && !isModule ? (['hollow'] as const) : [])
      ];

      return { name, thickness, flags: armorFlags(flags) };
    });
  };

  const gunModule = ({ gun, index }: GunModuleInput): ArmorGunModule[] => {
    const piece = resolvePiece({ declared: gun.collision ?? collision.modules[gun.name], kind: 'gun', index });

    if (!piece) {
      mismatches.push(`${spec.tag}: no collision piece for gun ${gun.name}`);

      return [];
    }

    return [
      {
        name: gun.name,
        displayName: gun.displayName,
        piece,
        plates: platesOf({ piece, kind: 'gun', armor: gun.armor ?? {}, spaced: gun.spacedArmor ?? [] }),
        shells: gun.shots.map((shot) => toShellOption({ shot, shellNames }))
      }
    ];
  };

  const turrets = spec.turrets.flatMap((turret, index): ArmorTurretModule[] => {
    const piece = resolvePiece({ declared: turret.collision, kind: 'turret', index });

    if (!piece) {
      return [];
    }

    return [
      {
        name: turret.name,
        displayName: turret.displayName,
        piece,
        plates: platesOf({ piece, kind: 'turret', armor: turret.armor, spaced: turret.spacedArmor ?? [] }),
        guns: turret.guns.flatMap((gun, gunIndex) => gunModule({ gun, index: gunIndex }))
      }
    ];
  });

  const chassis = spec.chassis.flatMap((item): ArmorChassisModule[] => {
    const piece = resolvePiece({ declared: item.collision ?? DEFAULT_PIECES.chassis, kind: 'chassis', index: 0 });

    return piece
      ? [
          {
            name: item.name,
            displayName: item.displayName,
            piece,
            plates: platesOf({ piece, kind: 'chassis', armor: item.armor, spaced: item.spacedArmor ?? [] })
          }
        ]
      : [];
  });

  const hullPiece = resolvePiece({ declared: spec.hull.collision ?? DEFAULT_PIECES.hull, kind: 'hull', index: 0 });

  if (!hullPiece) {
    throw new Error(`${spec.tag}: the collision model has no hull`);
  }

  const used = new Set([
    hullPiece,
    ...chassis.map(({ piece }) => piece),
    ...turrets.flatMap(({ piece, guns }) => [piece, ...guns.map((gun) => gun.piece)])
  ]);

  const { hullPosition, mounts } = collision;

  return {
    geometry: {
      pieces: pieces.filter((piece) => used.has(piece.name)),
      mounts: { hull: hullPosition ?? [0, 0, 0], turret: mounts.turret ?? [0, 0, 0], guns: mounts.guns, pitch: mounts.pitch }
    },
    modules: {
      hull: { piece: hullPiece, plates: platesOf({ piece: hullPiece, kind: 'hull', armor: spec.hull.armor, spaced: spec.hull.spacedArmor ?? [] }) },
      chassis,
      turrets
    },
    mismatches: unique(mismatches)
  };
};
