'use client';

import { useReferralCapture } from '../model/hooks';
import { PlusBenefits, PlusCheckout, PlusFaq, PlusHero } from './components';

import s from './PlusPage.module.scss';

export const PlusPage = () => {
  useReferralCapture();

  return (
    <div className={s.root}>
      <PlusHero />
      <div className={s.sections}>
        <PlusBenefits />
        <PlusCheckout />
        <PlusFaq />
      </div>
    </div>
  );
};
