import type { z } from 'zod';

import type { Coach } from '@/entities/coaching/coach';

import type { coachFormSchema } from './coach-form.schemas';

export type CoachFormValues = z.input<typeof coachFormSchema>;

export type CoachFormOutput = z.output<typeof coachFormSchema>;

export type ToCoachFormValuesInput = {
  coach: CoachProfileFields | null;
  fallbackAccountId: number | null;
};

export type CoachProfileFields = Pick<Coach, 'accountId' | 'bio' | 'contacts' | 'headline' | 'isActive' | 'tankIds'>;
