import type { BonusCode, BonusCodeReport } from '../../../../../generated';

export type BonusStatusInput = {
  working: number;
  expired: number;
  expiresAt: Date | null;
  now: Date;
};

export type ReportTally = {
  working: number;
  expired: number;
  lastReportAt: Date | null;
};

type VerdictCount = Pick<BonusCodeReport, 'code' | 'verdict'> & {
  count: number;
};

type LatestReport = Pick<BonusCodeReport, 'code'> & {
  createdAt: Date | null;
};

export type ReportTalliesInput = {
  counts: readonly VerdictCount[];
  latest: readonly LatestReport[];
};

export type ReportedStatusInput = {
  tally: ReportTally | undefined;
  expiresAt: Date | null;
  now: Date;
};

export type ReportedStatus = Pick<BonusCode, 'expiredReports' | 'lastReportAt' | 'status' | 'workingReports'>;
