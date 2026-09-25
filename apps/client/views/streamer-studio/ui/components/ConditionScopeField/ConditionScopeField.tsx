'use client';

import type { VehicleType } from '@bronevik/schemas';

import { toRoman } from '@bronevik/icons';
import { vehicleTypeSchema } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { match } from 'ts-pattern';

import { TankPicker, useVehicleCatalog } from '@/features/tank/pick-tank';
import { SegmentedControl, Select } from '@/ui-kit';

import type { ChallengeScope } from '../../../config';
import type { ChallengeFormOutput, ChallengeFormValues } from '../../../model/studio.types';

import { CHALLENGE_SCOPE_DEFAULTS, CHALLENGE_SCOPES, CHALLENGE_TIERS } from '../../../config';
import { FormField } from '../FormField';

import s from './ConditionScopeField.module.scss';

export const ConditionScopeField = () => {
  const t = useTranslations('streamer.challenges.condition');
  const tClass = useTranslations('game.classes');
  const { control, setValue } = useFormContext<ChallengeFormValues, unknown, ChallengeFormOutput>();
  const [tankId, tankType, minTier] = useWatch({ control, name: ['condition.tankId', 'condition.tankType', 'condition.minTier'] });
  const { data: vehicles } = useVehicleCatalog();
  const [scope, setScope] = useState<ChallengeScope>('any');

  const onScopeChange = (next: ChallengeScope) => {
    setScope(next);
    setValue('condition.tankId', undefined);
    setValue('condition.tankType', next === 'type' ? CHALLENGE_SCOPE_DEFAULTS.tankType : undefined);
    setValue('condition.minTier', next === 'tier' ? CHALLENGE_SCOPE_DEFAULTS.minTier : undefined);
  };

  return (
    <FormField className={s.root} label={t('scopeLabel')}>
      <SegmentedControl<ChallengeScope>
        aria-label={t('scopeLabel')}
        options={CHALLENGE_SCOPES.map((value) => ({ value, label: t(`scope.${value}`) }))}
        size='sm'
        value={scope}
        onChange={onScopeChange}
      />
      {match(scope)
        .with('tank', () => (
          <TankPicker
            value={vehicles?.find((vehicle) => vehicle.tankId === tankId) ?? null}
            onChange={(vehicle) => setValue('condition.tankId', vehicle?.tankId)}
          />
        ))
        .with('type', () => (
          <Select<VehicleType>
            items={vehicleTypeSchema.options.map((type) => ({ value: type, label: tClass(type) }))}
            value={tankType ?? CHALLENGE_SCOPE_DEFAULTS.tankType}
            onValueChange={(type) => setValue('condition.tankType', type)}
          />
        ))
        .with('tier', () => (
          <Select
            items={CHALLENGE_TIERS.map((tier) => ({ value: String(tier), label: t('tierOption', { tier: toRoman(tier) }) }))}
            value={String(minTier ?? CHALLENGE_SCOPE_DEFAULTS.minTier)}
            onValueChange={(tier) => setValue('condition.minTier', Number(tier))}
          />
        ))
        .with('any', () => null)
        .exhaustive()}
    </FormField>
  );
};
