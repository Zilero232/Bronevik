import { z } from 'zod';

import { zCreatePlatoon } from '@/shared/api/platoons';

import { PLATOON_FORM, PLATOON_TIERS } from '../../config';
import { localToIso } from '../platoon-query';

const optionalWn8 = z
  .string()
  .trim()
  .refine((value) => value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= PLATOON_FORM.maxWn8));

export const platoonFormSchema = z
  .object({
    accountId: z.string(),
    tiers: z.array(z.enum(PLATOON_TIERS)),
    modes: z.array(z.string()),
    tankIds: z.array(z.number().int().positive()),
    hasVoice: z.boolean(),
    minWn8: optionalWn8,
    message: zCreatePlatoon.shape.message.unwrap(),
    availableFrom: z.string(),
    availableUntil: z.string(),
    expiresInHours: z.string()
  })
  .refine(
    ({ availableFrom, availableUntil }) => {
      const from = localToIso(availableFrom);
      const until = localToIso(availableUntil);

      return !from || !until || from < until;
    },
    { path: ['availableUntil'] }
  );
