import type { VehicleSummary } from '@otmetki/schemas';

export type ShowcaseTank = VehicleSummary;

export type ShowcaseDrag = {
  isActive: boolean;
  x: number;
  impulse: number;
};
