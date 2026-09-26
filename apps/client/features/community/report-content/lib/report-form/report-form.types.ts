import type { z } from 'zod';

import type { ReportTargetType } from '@/shared/api/moderation';

import type { reportFormSchema } from './report-form.schemas';

export type ReportFormValues = z.input<typeof reportFormSchema>;

export type ReportFormOutput = z.output<typeof reportFormSchema>;

export type ReportTarget = {
  targetType: ReportTargetType;
  targetId: string;
};

export type ToCreateReportInput = ReportTarget & {
  values: ReportFormOutput;
};
