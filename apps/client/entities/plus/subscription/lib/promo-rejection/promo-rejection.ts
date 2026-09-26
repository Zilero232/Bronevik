import { apiErrorSchema } from '@otmetki/schemas';
import { isAxiosError } from 'axios';

import { PROMO_REJECTION_CODES } from '../../config';

export const isPromoRejection = (error: unknown): boolean => {
  if (!isAxiosError(error)) {
    return false;
  }

  const parsed = apiErrorSchema.safeParse(error.response?.data);

  return parsed.success && PROMO_REJECTION_CODES.includes(parsed.data.code);
};
