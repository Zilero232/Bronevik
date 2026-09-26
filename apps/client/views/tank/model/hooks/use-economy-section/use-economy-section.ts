'use client';

import type { EconomyAccount } from '@otmetki/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { economyView } from '@/entities/tank/tank';

import { useTank } from '../../context';

export const useEconomySection = () => {
  const { detail } = useTank();
  const [account, setAccount] = useState<EconomyAccount>('premium');
  const [withReserve, toggleReserve] = useBoolean(false);

  const { economy } = detail;
  const view = economyView({ economy, account, withReserve });
  const hasData = economy.all !== null;

  return { account, setAccount, withReserve, onReserveChange: toggleReserve, view, hasData, windowDays: economy.windowDays };
};
