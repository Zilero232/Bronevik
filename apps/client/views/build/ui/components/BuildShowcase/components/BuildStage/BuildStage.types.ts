import type { VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type BuildStageProps = {
  vehicle: VehicleSummary;
  tanksHref: { nation: string; type: string; tier: string };
  toggle: ReactNode;
  left: ReactNode;
  right: ReactNode;
  stats: ReactNode;
  compare: ReactNode;
  notice: ReactNode;
  actions: ReactNode;
};
