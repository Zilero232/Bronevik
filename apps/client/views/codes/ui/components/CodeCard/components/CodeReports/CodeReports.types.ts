import type { BonusCode } from '@otmetki/schemas';

import type { CodeReportVerdict } from '../../../../../model/hooks';

export type CodeReportsProps = {
  code: Pick<BonusCode, 'expiredReports' | 'status' | 'workingReports'>;
  isSignedIn: boolean;
  isReporting: boolean;
  loginHref: string;
  onReport: (verdict: CodeReportVerdict) => void;
};
