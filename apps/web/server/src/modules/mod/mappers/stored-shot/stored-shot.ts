import type { StoredShot } from '../../../analytics';
import type { ModShot } from './stored-shot.types';

export const toStoredShot = (shot: ModShot): StoredShot => ({
  damage: shot.damage,
  nominal: shot.nominal,
  shell: shot.shell,
  outcome: shot.outcome,
  distance: shot.distance_m,
  fatal: shot.fatal
});
