import type { z } from 'zod';

import type { apiErrorCodeSchema, apiErrorDetailsSchema, apiErrorIssueSchema, apiErrorSchema } from './errors.schemas';

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiErrorIssue = z.infer<typeof apiErrorIssueSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiErrorDetails = z.infer<typeof apiErrorDetailsSchema>;
