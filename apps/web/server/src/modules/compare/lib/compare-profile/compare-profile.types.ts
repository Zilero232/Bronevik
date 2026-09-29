import type { VehicleProfile } from '../../../../../generated';

export type ComparedProfile = Pick<VehicleProfile, 'isDefault' | 'profileId' | 'tankId'>;

export type PickProfileInput<T extends ComparedProfile> = {
  profiles: readonly T[];
  tankId: number;
  wanted: string | undefined;
};
