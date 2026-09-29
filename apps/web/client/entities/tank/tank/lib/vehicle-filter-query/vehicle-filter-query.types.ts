import type { TanksControllerListData } from '@/shared/api/generated';

export type VehicleFilterLists = Pick<
  NonNullable<TanksControllerListData['query']>,
  'difficulties' | 'nations' | 'roles' | 'statuses' | 'tiers' | 'types'
>;
