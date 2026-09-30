import type { ReactNode } from 'react';

import type { MapSampleRow } from '../model/hooks';

export type MapSamplesTableProps = {
  rows: MapSampleRow[];
  nameLabel: ReactNode;
  windowDays: number;
  minBattles: number;
  isLoading?: boolean;
};
