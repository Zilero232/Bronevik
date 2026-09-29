import type { ReportFormValues } from '../lib/report-form';

import { zCreateReport } from '../api';

export const REPORT_FORM = {
  reasons: zCreateReport.shape.reason.options,
  detailsMaxLength: zCreateReport.shape.details.unwrap().maxLength ?? undefined,
  defaultValues: { reason: 'spam', details: '' } satisfies ReportFormValues
} as const;
