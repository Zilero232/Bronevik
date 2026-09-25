'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { useCheckoutReturn } from '../model/hooks';
import { BillingHeading, PaymentHistory, PromoRedeemCard, ReferralCard, StatusPanel } from './components';

import s from './BillingPage.module.scss';

export const BillingPage = () => {
  useCheckoutReturn();

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <BillingHeading />
      <motion.div variants={STAGGER_ITEM}>
        <StatusPanel />
      </motion.div>
      <div className={s.grid}>
        <motion.div variants={STAGGER_ITEM}>
          <PromoRedeemCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <ReferralCard />
        </motion.div>
      </div>
      <motion.div variants={STAGGER_ITEM}>
        <PaymentHistory />
      </motion.div>
    </motion.div>
  );
};
