import { chosenAccountId } from '@/entities/auth/session';
import { zonedInputToIso } from '@/shared/lib';

import type { CreatePlatoon } from '../../api';
import type { PlatoonFormOutput } from './platoon-form.types';

export const toCreatePlatoon = (values: PlatoonFormOutput): CreatePlatoon => {
  const message = values.message.trim();
  const availableFrom = zonedInputToIso({ value: values.availableFrom });
  const availableUntil = zonedInputToIso({ value: values.availableUntil });
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
