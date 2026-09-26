'use client';

import { useCheckoutReturn } from '../model/hooks';
import { BillingHeader, PaymentHistory, PromoRedeemCard, ReferralCard, StatusPanel } from './components';

import s from './BillingPage.module.scss';

export const BillingPage = () => {
  useCheckoutReturn();

  return (
    <div className={s.root}>
      <BillingHeader />
      <StatusPanel />
      <div className={s.grid}>
        <PromoRedeemCard />
        <ReferralCard />
      </div>
      <PaymentHistory />
    </div>
  );
};
