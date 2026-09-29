import type { TankRole, VehicleSummary } from '@otmetki/schemas';

import type { VehicleKind } from '../vehicle-query';

export type KindFlags = Pick<VehicleSummary, 'isCollectible' | 'isPremium'>;

export type MatchesKindInput = {
  kind: VehicleKind;
  vehicle: KindFlags;
};

export type MatchesRolesInput = {
  role: TankRole | null;
  roles: readonly TankRole[];
};

export type TraitRowsInput<T> = {
  rows: readonly T[];
  vehicleOf: (row: T) => KindFlags & Pick<VehicleSummary, 'tankId'>;
};

export type FilterByTraitsInput<T> = TraitRowsInput<T> & {
  kind: VehicleKind;
  roles: readonly TankRole[];
  roleOf: ((tankId: number) => TankRole | null) | null;
};
