import { PLUS } from '@otmetki/schemas';

import { NOTIFICATION_TOKENS } from '../config';

export const plusCheckoutProvider = {
  provide: NOTIFICATION_TOKENS.plusCheckoutEnabled,
  useValue: PLUS.checkoutEnabled
};
