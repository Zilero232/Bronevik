import type { BonusCode, BonusCodeReportInput } from '@otmetki/schemas';

import { shopControllerReport } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const reportBonusCode = (input: BonusCodeReportInput): Promise<BonusCode> =>
  fromSdk(() => shopControllerReport({ ...SESSION_REQUEST, body: input }));
