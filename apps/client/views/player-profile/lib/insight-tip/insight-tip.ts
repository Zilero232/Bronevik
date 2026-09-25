import { TIERS, toRoman } from '@bronevik/icons';

import type { TipValues, TipValuesInput } from './insight-tip.types';

const PERCENT = 100;

const numberParam = (value: number | string | undefined) => (typeof value === 'number' ? value : Number(value ?? 0));

export const tipValues = ({ tip, insights }: TipValuesInput): TipValues => {
  const { params } = tip;
  const vehicles = [...insights.weakTanks, ...insights.strongTanks].map(({ vehicle }) => vehicle);
  const tank = vehicles.find(({ tankId }) => tankId === numberParam(params.tankId));
  const tier = TIERS.find((value) => value === numberParam(params.tier));

  return {
    ...params,
    winRateDelta: Math.abs(numberParam(params.winRateDelta)).toFixed(1),
    damageRatio: Math.round(numberParam(params.damageRatio) * PERCENT),
    tank: tank?.shortName ?? tank?.name ?? '—',
    tierRoman: tier ? toRoman(tier) : String(params.tier ?? '')
  };
};
