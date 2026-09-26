import type { BattleResultEvent } from '../../lib/contract';

export type ModShot = NonNullable<BattleResultEvent['shots']>[number];

export type StoredShotRecord = {
  damage: number;
  nominal: number | null;
  shell: ModShot['shell'];
  outcome: ModShot['outcome'];
  distance: number | null;
  fatal: boolean;
};
