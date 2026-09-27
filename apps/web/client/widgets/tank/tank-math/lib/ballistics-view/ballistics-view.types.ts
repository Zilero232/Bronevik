import type { TankMathShell } from '../../api';

export type BallisticsSeries = {
  distances: number[];
  penetration: { shell: string; values: number[] }[];
  flightTime: { shell: string; values: number[] }[];
};

export type ShellRow = Pick<TankMathShell, 'caliber' | 'damage' | 'isPremium' | 'kind' | 'shell' | 'speed'> & {
  penetration: number[];
  flightTime: number | null;
  penetrationDelta: number[] | null;
  flightTimeDelta: number | null;
};
