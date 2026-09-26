import type { TankRarity } from '../../../../../generated';

export type TankOwnersRow = Pick<TankRarity, 'owners' | 'sample' | 'tankId'>;
