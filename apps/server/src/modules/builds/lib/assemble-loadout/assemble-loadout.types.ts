import type { LoadoutInput, VehicleSpec } from '@bronevik/gamedata';
import type { ParsedLoadoutRequest } from '@bronevik/schemas';

import type { CrewSkill, Provision, ProvisionType } from '../../../../../generated';

export type AssembleLoadoutInput = {
  tankId: number;
  vehicle: VehicleSpec;
  request: ParsedLoadoutRequest;
  provisions: readonly Provision[];
  skills: readonly CrewSkill[];
};

export type AssembledLoadout = {
  input: LoadoutInput;
  profileId: string;
  ignored: string[];
};

export type PickProvisionsInput<T> = {
  ids: readonly (number | null)[];
  type: ProvisionType;
  guard: (value: unknown) => value is T;
};
