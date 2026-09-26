'use client';

import type { EconomyValues } from './use-economy-calculator.types';

import { ECONOMY } from '../../../config';
import { shellPriceValues } from '../../../lib/calc-defaults';
import { useCalcState } from '../use-calc-state';

export const useEconomyCalculator = () => {
  const { values, field, replace } = useCalcState<EconomyValues>({
    ...ECONOMY.defaults,
    ...shellPriceValues(ECONOMY.defaults.tier),
    isPremiumVehicle: false
  });

  const onTierChange = (tier: number) => replace({ ...values, tier, ...shellPriceValues(tier) });

  return { values, field, onTierChange };
};
