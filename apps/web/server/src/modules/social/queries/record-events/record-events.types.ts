import type { SnapshotEventsSqlInput } from '../tank-events';

export type RecordEventsSqlInput = Omit<SnapshotEventsSqlInput, 'aceMastery'>;

export type RecordEventRow = {
  account_id: bigint;
  captured_at: Date;
  max_damage: number | null;
  prev_max_damage: number | null;
  max_damage_tank_id: number | null;
};
