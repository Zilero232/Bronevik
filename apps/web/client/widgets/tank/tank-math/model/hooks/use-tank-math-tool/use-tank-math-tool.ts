'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useState } from 'react';

export const useTankMathTool = () => {
  const [vehicle, setVehicle] = useState<VehicleSummary | null>(null);

  return { vehicle, setVehicle };
};
