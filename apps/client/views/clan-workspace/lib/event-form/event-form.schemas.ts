import { z } from 'zod';

import { zonedInputToIso } from '@/shared/lib';

import { zCreateClanEvent } from '../../api';
import { EVENT_KINDS, REMIND_OPTIONS } from '../../config';
import { toNewWorkspaceEvent } from './event-form';

const localDate = z.string().refine((value) => zonedInputToIso({ value }) !== undefined);

export const eventFormFieldsSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    kind: z.enum(EVENT_KINDS),
    startsAt: localDate,
    endsAt: z.string(),
    remind: z.enum(REMIND_OPTIONS)
  })
  .refine(
    ({ startsAt, endsAt }) => {
      const end = zonedInputToIso({ value: endsAt });

      return end === undefined || end > (zonedInputToIso({ value: startsAt }) ?? '');
    },
    { path: ['endsAt'] }
  );

export const eventFormSchema = eventFormFieldsSchema.transform(toNewWorkspaceEvent).pipe(zCreateClanEvent);
