'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField, TierNumeral, ToggleChips } from '@/ui-kit';

import type { PlatoonFormOutput, PlatoonFormValues } from '../../../../../lib/platoon-form';

import { PLATOON_MODES, PLATOON_TIERS } from '../../../../../config';

export const PlatoonScopeFields = () => {
  const t = useTranslations('platoons.create');
  const tModes = useTranslations('platoons.modes');
  const { control } = useFormContext<PlatoonFormValues, unknown, PlatoonFormOutput>();

  return (
    <>
      <FormField label={t('tiers')}>
        <Controller
          render={({ field }) => (
            <ToggleChips
              aria-label={t('tiers')}
              options={PLATOON_TIERS.map((tier) => ({ value: tier, label: <TierNumeral tier={Number(tier)} /> }))}
              size='sm'
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='tiers'
        />
      </FormField>
      <FormField label={t('modes')}>
        <Controller
          render={({ field }) => (
            <ToggleChips
              aria-label={t('modes')}
              options={PLATOON_MODES.map((mode) => ({ value: mode, label: tModes(mode) }))}
              size='sm'
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='modes'
        />
      </FormField>
    </>
  );
};
