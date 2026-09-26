'use client';

import { useReferralCapture } from '../model/hooks';
import { PlusBenefits, PlusCheckout, PlusFaq, PlusHeader } from './components';

import s from './PlusPage.module.scss';

export const PlusPage = () => {
  useReferralCapture();

  return (
    <div className={s.root}>
      <PlusHeader />
      <PlusCheckout />
      <PlusBenefits />
      <PlusFaq />
    </div>
  );
};
