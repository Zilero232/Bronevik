import type { ShellStats } from '../../loadout';
import type { Shot } from '../../model';

export type BallisticShell = Pick<ShellStats, 'kind' | 'penetration100m' | 'penetration500m' | 'speed'> & Pick<Shot, 'gravity' | 'maxDistance'>;

export type ShellAtDistanceInput = {
  shell: BallisticShell;
  distance: number;
};

export type BallisticsCurveInput = {
  shell: BallisticShell;
  distances: readonly number[];
};

export type BallisticsPoint = {
  distance: number;
  penetration: number;
  flightTime: number | null;
};
