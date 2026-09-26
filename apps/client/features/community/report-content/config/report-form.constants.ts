import { zCreateReport } from '../api';

import type { ReportFormValues } from '../lib/report-form';

export const REPORT_REASONS = zCreateReport.shape.reason.options;

export const REPORT_DETAILS_MAX_LENGTH = zCreateReport.shape.details.unwrap().maxLength ?? undefined;

export const REPORT_FORM_DEFAULT_VALUES: ReportFormValues = { reason: 'spam', details: '' };
