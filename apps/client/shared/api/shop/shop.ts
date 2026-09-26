import type { BonusCode, BonusCodeReportInput } from '@otmetki/schemas';

import { shopControllerReport } from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const reportBonusCode = (input: BonusCodeReportInput): Promise<BonusCode> =>
  fromSdk(() => shopControllerReport({ ...SESSION_REQUEST, body: input }));
