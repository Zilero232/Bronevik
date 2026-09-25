import type { BillingStatus, CheckoutInput, CheckoutResult, PaymentHistory, PaymentHistoryItem, Plans, PromoRedeemInput } from '@bronevik/schemas';

import { addDays, addMonths, subMonths } from 'date-fns';

import { SITE } from '@/shared/config/site';
import { isBrowser, seededRandom } from '@/shared/lib';
import { mockUuid } from '@/shared/mocks';

import { BILLING_MOCK } from './billing.mock.constants';

const random = seededRandom(7_331);

const plans: Plans = [
  { plan: 'monthly', months: 1, priceRub: BILLING_MOCK.monthlyRub },
  { plan: 'yearly', months: 12, priceRub: BILLING_MOCK.yearlyRub }
];

let status: BillingStatus = {
  isPlus: true,
  plan: 'monthly',
  status: 'active',
  currentPeriodEnd: addDays(new Date(), 17).toISOString(),
  cancelAtPeriodEnd: false,
  card: 'Visa •• 4242',
  isRecurringAvailable: true,
  plans
};

const payment = (monthsAgo: number): PaymentHistoryItem => {
  const createdAt = subMonths(new Date(), monthsAgo);
  const isFirst = monthsAgo === BILLING_MOCK.historyMonths;

  return {
    id: mockUuid(random),
    amount: isFirst ? BILLING_MOCK.monthlyRub * (1 - BILLING_MOCK.promoDiscount) : BILLING_MOCK.monthlyRub,
    currency: 'RUB',
    status: monthsAgo === 2 ? 'canceled' : 'succeeded',
    plan: 'monthly',
    isAutoCharge: !isFirst,
    promoCode: isFirst ? 'FIRSTBLOOD' : null,
    createdAt: createdAt.toISOString(),
    paidAt: monthsAgo === 2 ? null : createdAt.toISOString()
  };
};

const history: PaymentHistory = Array.from({ length: BILLING_MOCK.historyMonths }, (_, index) => payment(index + 1));

const origin = () => (isBrowser() ? window.location.origin : SITE.url);

export const mockBilling = {
  plans: () => plans,
  status: () => status,
  history: () => history,
  checkout: ({ plan }: CheckoutInput): CheckoutResult => {
    status = {
      ...status,
      isPlus: true,
      plan,
      status: 'active',
      cancelAtPeriodEnd: false,
      currentPeriodEnd: addMonths(new Date(), plan === 'yearly' ? 12 : 1).toISOString()
    };

    return { confirmationUrl: `${origin()}${BILLING_MOCK.returnPath}`, paymentId: mockUuid(Math.random) };
  },
  setAutoRenew: (isEnabled: boolean) => {
    status = { ...status, cancelAtPeriodEnd: !isEnabled };

    return status;
  },
  redeemPromo: ({ code }: PromoRedeemInput) => {
    if (code.trim().toUpperCase() !== BILLING_MOCK.freeDaysCode) {
      throw new Error('PROMO_NOT_FOUND');
    }

    const end = status.currentPeriodEnd ? new Date(status.currentPeriodEnd) : new Date();

    status = { ...status, isPlus: true, status: 'active', currentPeriodEnd: addDays(end, BILLING_MOCK.freeDays).toISOString() };

    return status;
  }
};
