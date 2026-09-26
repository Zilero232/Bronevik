'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { useState } from 'react';

import type { ResearchValues } from './use-research-calculator.types';

import { RESEARCH } from '../../../config';
import { useCalcState } from '../use-calc-state';
import { useTechTreeCost } from '../use-tech-tree-cost';

export const useResearchCalculator = () => {
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);
  const { values, field } = useCalcState<ResearchValues>({ ...RESEARCH.defaults, isPremium: false });
  const { cost } = useTechTreeCost(vehicle);

  return { vehicle, setVehicle, values, field, cost };
};
