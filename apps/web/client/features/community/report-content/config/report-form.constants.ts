import type { ReportFormValues } from '../lib/report-form';

import { zCreateReport } from '../api';

export const REPORT_REASONS = zCreateReport.shape.reason.options;

export const REPORT_DETAILS_MAX_LENGTH = zCreateReport.shape.details.unwrap().maxLength ?? undefined;

export const REPORT_FORM_DEFAULT_VALUES: ReportFormValues = { reason: 'spam', details: '' };
