import type { VehicleStats } from '@otmetki/schemas';

export type LiveValueInput = {
  param: string | null;
  label: string;
  stats: VehicleStats | null;
};

export type ShellForInput = Pick<LiveValueInput, 'label'> & {
  stats: VehicleStats;
};
