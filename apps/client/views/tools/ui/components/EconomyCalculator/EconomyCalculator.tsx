'use client';

import { useTranslations } from 'next-intl';

import { RangeSlider, Switch } from '@/ui-kit';

import type { EconomyValues } from './EconomyCalculator.types';

import { ECONOMY } from '../../../config';
import { defaultShellPrices } from '../../../lib/battle-economy';
import { useCalcState } from '../../../model/hooks';
import { CalcShell, FieldGrid } from '../CalcKit';
import { EconomyResults, EconomyShells } from './components';

const withTierPrices = (tier: number) => {
  const { ap, heat, he } = defaultShellPrices(tier);

  return { apPrice: ap, heatPrice: heat, hePrice: he };
};

export const EconomyCalculator = () => {
  const t = useTranslations('tools.economy');
  const { values, field, replace } = useCalcState<EconomyValues>({
    ...ECONOMY.defaults,
    ...withTierPrices(ECONOMY.defaults.tier),
    isPremiumVehicle: false
  });

  const { tier, isPremiumVehicle } = values;

  return (
    <CalcShell
      inputs={
        <>
          <RangeSlider
            {...ECONOMY.tierRange}
            label={t('tier')}
            value={tier}
            valueLabel={t('tierValue', { tier })}
            onValueChange={(next) => replace({ ...values, tier: next, ...withTierPrices(next) })}
          />
          <Switch
            checked={isPremiumVehicle}
            description={t('premiumVehicleHint')}
            label={t('premiumVehicle')}
            onCheckedChange={field('isPremiumVehicle')}
          />
          <FieldGrid
            fields={[
              { key: 'damage', label: t('fields.damage'), ...ECONOMY.damageRange },
              { key: 'spotting', label: t('fields.spotting'), ...ECONOMY.damageRange },
              { key: 'standard', label: t('fields.standard'), ...ECONOMY.consumableRange },
              { key: 'premium', label: t('fields.premium'), ...ECONOMY.consumableRange }
            ]}
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
          <EconomyShells values={values} onChange={({ key, value }) => field(key)(value)} />
        </>
      }
      description={t('description')}
      footer={t('footer')}
      results={<EconomyResults values={values} />}
      title={t('title')}
    />
  );
};
