import type { z } from 'zod';

import type { RecruitingKind } from '@/shared/api/recruiting';

import type { recruitingFormSchema } from './recruiting-form.schemas';

export type RecruitingFormValues = z.input<typeof recruitingFormSchema>;

export type RecruitingFormOutput = z.output<typeof recruitingFormSchema>;

export type ToCreateRecruitingInput = {
  values: RecruitingFormOutput;
  kind: RecruitingKind;
  clanId: number | null;
};
