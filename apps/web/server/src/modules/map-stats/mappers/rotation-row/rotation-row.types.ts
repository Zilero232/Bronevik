import type { Arena, MapRotationAggregate } from '../../../../../generated';

export type RotationArena = Pick<Arena, 'arenaId' | 'camouflageType' | 'image' | 'name' | 'slug'>;

export type RotationRowInput = {
  row: Pick<MapRotationAggregate, 'arenaId' | 'battles' | 'modBattles' | 'replayBattles' | 'share'>;
  arena: RotationArena | undefined;
};
