import type { CODES } from '../../../config';

export type CodeReportVerdict = (typeof CODES.verdicts)[number];

export type UseCodeReportInput = {
  code: string;
};
