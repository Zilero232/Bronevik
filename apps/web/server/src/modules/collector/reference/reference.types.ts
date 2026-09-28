import type { VehicleType } from '../../../../generated';
import type { Vehicle } from '../../../lib/lesta';

export type SectionRunner = () => Promise<number>;

export type VersionCheckResult = {
  version: string;
  changed: boolean;
};

export type WriteVehicleInput = {
  vehicle: Vehicle;
  type: VehicleType;
  slug: string;
  prevTankIds: number[];
};

export type EnglishNamesResult = {
  arenas: number;
  achievements: number;
  crewSkills: number;
};
