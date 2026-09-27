'use client';

import type { NATIONS } from '@otmetki/icons';
import type { RecentPeriod } from '@otmetki/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

export const useControlsSection = () => {
  const [period, setPeriod] = useState<RecentPeriod>('7d');
  const [nation, setNation] = useState<(typeof NATIONS)[number]>('ussr');
  const [isOn, toggleOn] = useBoolean(true);

  return { period, setPeriod, nation, setNation, isOn, toggleOn };
};
