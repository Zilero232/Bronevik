'use client';

import type { VehicleType } from '@otmetki/schemas';

import { toRoman } from '@otmetki/icons';
import { vehicleTypeSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { TankPicker } from '@/features/tank/pick-tank';
import { FormField, SegmentedControl, Select } from '@/ui-kit';

import type { ChallengeScope } from '../../../config';

import { CHALLENGE_SCOPES, CHALLENGE_TIERS } from '../../../config';
import { useConditionScopeField } from '../../../model/hooks';

import s from './ConditionScopeField.module.scss';

export const ConditionScopeField = () => {
  const t = useTranslations('streamer.challenges.condition');
  const tClass = useTranslations('game.classes');
  const { scope, vehicle, tankType, minTier, onScopeChange, onVehicleChange, onTankTypeChange, onMinTierChange } = useConditionScopeField();

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
        .with('tank', () => <TankPicker value={vehicle} onChange={onVehicleChange} />)
        .with('type', () => (
          <Select<VehicleType>
            items={vehicleTypeSchema.options.map((type) => ({ value: type, label: tClass(type) }))}
            value={tankType}
            onValueChange={onTankTypeChange}
          />
        ))
        .with('tier', () => (
          <Select
            items={CHALLENGE_TIERS.map((tier) => ({ value: String(tier), label: t('tierOption', { tier: toRoman(tier) }) }))}
            value={minTier}
            onValueChange={onMinTierChange}
          />
        ))
        .with('any', () => null)
        .exhaustive()}
    </FormField>
  );
};
