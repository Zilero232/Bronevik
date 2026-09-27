import type { ApiErrorDetails } from '@otmetki/schemas';

import type { PLUS_REQUIRED_CODES } from '../source.constants';

export type PlusRequiredCode = (typeof PLUS_REQUIRED_CODES)[number];

export type PlusRequiredErrorInput = {
  code: PlusRequiredCode;
  details: ApiErrorDetails;
  message: string;
};
