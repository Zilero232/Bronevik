import type { BonusCode } from '@otmetki/schemas';

import type { CODES } from '../../../config';

export type CodeReportVerdict = (typeof CODES.verdicts)[number];

export type UseCodeCardInput = {
  code: BonusCode;
};
