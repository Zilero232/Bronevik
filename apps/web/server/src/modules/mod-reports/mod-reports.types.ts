import type { ModProblemReportRequest } from '@otmetki/schemas';

export type SubmitReportInput = {
  body: ModProblemReportRequest;
  ip: string;
};
