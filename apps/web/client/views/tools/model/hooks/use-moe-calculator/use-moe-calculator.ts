'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useState } from 'react';

import type { MoeValues } from './use-moe-calculator.types';

import { MOE_CALC } from '../../../config';
import { useCalcState } from '../use-calc-state';

export const useMoeCalculator = () => {
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);
  const { values, field } = useCalcState<MoeValues>({ ...MOE_CALC.defaults, target: '3' });

  return { vehicle, setVehicle, values, field };
};
