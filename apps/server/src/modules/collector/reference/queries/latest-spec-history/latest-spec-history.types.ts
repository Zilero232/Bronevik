import type { VehicleSpecHistory } from '../../../../../../generated';

export type LatestSpecRow = Pick<VehicleSpecHistory, 'specs' | 'tankId'>;
