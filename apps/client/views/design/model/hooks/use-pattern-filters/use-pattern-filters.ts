'use client';

import type { Nation, TankClass } from '@otmetki/icons';

import { useState } from 'react';

import { PATTERN_SPECIMENS } from '../../../config';

export const usePatternFilters = () => {
  const [tiers, setTiers] = useState<number[]>([...PATTERN_SPECIMENS.initialTiers]);
  const [classes, setClasses] = useState<TankClass[]>(['heavyTank']);
  const [nations, setNations] = useState<Nation[]>(['ussr', 'germany']);

  return { tiers, setTiers, classes, setClasses, nations, setNations };
};
