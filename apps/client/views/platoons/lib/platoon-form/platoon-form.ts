import type { CreatePlatoon } from '@/shared/api/platoons';

import { chosenAccountId } from '@/features/community/viewer';

import type { PlatoonFormOutput } from './platoon-form.types';

import { localToIso } from '../platoon-query';

export const toCreatePlatoon = (values: PlatoonFormOutput): CreatePlatoon => {
  const message = values.message.trim();
  const availableFrom = localToIso(values.availableFrom);
  const availableUntil = localToIso(values.availableUntil);
  const accountId = chosenAccountId(values.accountId);

  return {
    ...(accountId === undefined ? {} : { accountId }),
    tiers: values.tiers.map(Number).sort((left, right) => left - right),
    modes: values.modes,
    tankIds: values.tankIds,
    hasVoice: values.hasVoice,
    ...(values.minWn8.trim() === '' ? {} : { minWn8: Number(values.minWn8) }),
    ...(message === '' ? {} : { message }),
    ...(availableFrom ? { availableFrom } : {}),
    ...(availableUntil ? { availableUntil } : {}),
    expiresInHours: Number(values.expiresInHours)
  };
};
