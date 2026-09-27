import type { CheckoutInput } from '@otmetki/schemas';

export const PLUS_CHECKOUT_FORM_DEFAULT_VALUES = { plan: 'yearly', promoCode: undefined } as const satisfies CheckoutInput;
