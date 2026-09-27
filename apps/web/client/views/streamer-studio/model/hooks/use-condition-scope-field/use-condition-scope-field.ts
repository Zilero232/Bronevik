'use client';

import type { VehicleSummary, VehicleType } from '@otmetki/schemas';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { ChallengeScope } from '../../../config';
import type { ChallengeFormOutput, ChallengeFormValues } from '../../studio.types';

import { CHALLENGE_SCOPE_DEFAULTS } from '../../../config';

export const useConditionScopeField = () => {
  const { control, setValue } = useFormContext<ChallengeFormValues, unknown, ChallengeFormOutput>();
  const [tankId, tankType, minTier] = useWatch({ control, name: ['condition.tankId', 'condition.tankType', 'condition.minTier'] });
  const { data: vehicles } = useVehicleCatalog();
  const [scope, setScope] = useState<ChallengeScope>('any');

  const vehicle = vehicles?.find((item) => item.tankId === tankId) ?? null;

  const onScopeChange = (next: ChallengeScope) => {
    setScope(next);
    setValue('condition.tankId', undefined);
    setValue('condition.tankType', next === 'type' ? CHALLENGE_SCOPE_DEFAULTS.tankType : undefined);
    setValue('condition.minTier', next === 'tier' ? CHALLENGE_SCOPE_DEFAULTS.minTier : undefined);
  };

  const onVehicleChange = (next: VehicleSummary | null) => setValue('condition.tankId', next?.tankId);
  const onTankTypeChange = (next: VehicleType) => setValue('condition.tankType', next);
  const onMinTierChange = (next: string) => setValue('condition.minTier', Number(next));

  return {
    scope,
    vehicle,
    tankType: tankType ?? CHALLENGE_SCOPE_DEFAULTS.tankType,
    minTier: String(minTier ?? CHALLENGE_SCOPE_DEFAULTS.minTier),
    onScopeChange,
    onVehicleChange,
    onTankTypeChange,
    onMinTierChange
  };
};
