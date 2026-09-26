'use client';

import { useTranslations } from 'next-intl';

import { RangeSlider, Switch } from '@/ui-kit';

import { ECONOMY } from '../../../config';
import { useEconomyCalculator } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { EconomyResults, EconomyShells } from './components';

export const EconomyCalculator = () => {
  const t = useTranslations('tools.economy');
  const { values, field, onTierChange } = useEconomyCalculator();

  return (
    <CalcShell
      inputs={
        <>
          <RangeSlider
            {...ECONOMY.tierRange}
            label={t('tier')}
            value={values.tier}
            valueLabel={t('tierValue', { tier: values.tier })}
            onValueChange={onTierChange}
          />
          <Switch
            checked={values.isPremiumVehicle}
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
