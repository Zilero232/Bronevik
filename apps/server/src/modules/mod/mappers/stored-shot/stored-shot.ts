import type { ModShot, StoredShotRecord } from './stored-shot.types';

export const toStoredShot = (shot: ModShot): StoredShotRecord => ({
  damage: shot.damage,
  nominal: shot.nominal,
  shell: shot.shell,
  outcome: shot.outcome,
  distance: shot.distance_m,
  fatal: shot.fatal
});
