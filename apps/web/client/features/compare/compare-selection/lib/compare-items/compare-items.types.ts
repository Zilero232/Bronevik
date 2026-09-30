import type { PlayerSummary, VehicleSummary } from '@otmetki/schemas';

import type { COMPARE_KINDS } from '../../config';

export type CompareKind = (typeof COMPARE_KINDS)[number];

export type CompareTank = Pick<VehicleSummary, 'images' | 'isPremium' | 'name' | 'nation' | 'shortName' | 'slug' | 'tankId' | 'tier' | 'type'>;

export type ComparePlayer = Pick<PlayerSummary, 'accountId' | 'nickname'>;

export type CompareSelection = {
  tank: CompareTank[];
  player: ComparePlayer[];
  active: CompareKind;
};

export type CompareEntry = { kind: 'player'; item: ComparePlayer } | { kind: 'tank'; item: CompareTank };

export type CompareEntryInput = {
  selection: CompareSelection;
  entry: CompareEntry;
};

export type CompareKindInput = {
  selection: CompareSelection;
  kind: CompareKind;
};

export type RemoveCompareInput = {
  selection: CompareSelection;
  kind: CompareKind;
  id: number;
};

export type CompareHrefInput = {
  kind: CompareKind;
  ids: readonly number[];
};
