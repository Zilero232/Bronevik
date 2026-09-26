'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { usePlusCheckoutForm } from '../../../model/hooks';
import { CheckoutAction, PlanTable, PromoField } from './components';

import s from './PlusCheckout.module.scss';

export const PlusCheckout = () => {
  const t = useTranslations('plus.checkout');
  const { offers, access, planRegistration, promoRegistration, promoError, isSubmitting, onSubmit } = usePlusCheckoutForm();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <form noValidate className={s.panel} onSubmit={onSubmit}>
        <PlanTable
          isError={offers.isError}
          isPending={offers.isPending}
          isRetrying={offers.isRetrying}
          pricing={offers.pricing}
          registration={planRegistration}
          onRetry={offers.retry}
        />
        {access.isSignedIn && !access.isPlus && <PromoField error={promoError} registration={promoRegistration} />}
        <CheckoutAction isPending={access.isPending} isPlus={access.isPlus} isSignedIn={access.isSignedIn} isSubmitting={isSubmitting} />
      </form>
    </section>
  );
};
