import type { CreateReport } from '@/shared/api/moderation';

import type { ToCreateReportInput } from './report-form.types';

export const toCreateReport = ({ values, targetType, targetId }: ToCreateReportInput): CreateReport => ({
  targetType,
  targetId,
  reason: values.reason,
  ...(values.details === '' ? {} : { details: values.details })
});
