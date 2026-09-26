import type { MapRotationAggregate } from '../../../../../generated';

export type RotationCount = Pick<MapRotationAggregate, 'arenaId' | 'battles' | 'modBattles' | 'mode' | 'replayBattles' | 'tier'>;

export type RotationShare = RotationCount & Pick<MapRotationAggregate, 'share'>;
