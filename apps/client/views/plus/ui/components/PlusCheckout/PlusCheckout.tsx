'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { usePlusCheckoutForm } from '../../../model/hooks';
import { CheckoutAction, PlanTable, PromoField } from './components';

import s from './PlusCheckout.module.scss';

export const PlusCheckout = () => {
  const t = useTranslations('plus.checkout');
  const { offers, access, note, planRegistration, promoRegistration, promoError, isSubmitting, isStartingTrial, onSubmit, onStartTrial } =
    usePlusCheckoutForm();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <form noValidate className={s.panel} onSubmit={onSubmit}>
        <PlanTable
          isError={offers.isError}
          isPending={offers.isPending}
          isRetrying={offers.isRetrying}
          pricing={offers.pricing}
          recommended={offers.recommended}
          registration={planRegistration}
          onRetry={offers.retry}
        />
        {access.isSignedIn && !access.isPlus && access.isCheckoutAvailable && <PromoField error={promoError} registration={promoRegistration} />}
        <CheckoutAction
          isCheckoutAvailable={access.isCheckoutAvailable}
          isPending={access.isPending}
          isPlus={access.isPlus}
          isSignedIn={access.isSignedIn}
          isStartingTrial={isStartingTrial}
          isSubmitting={isSubmitting}
          note={note}
          trialAvailable={access.trialAvailable}
          trialDays={access.trialDays}
          onStartTrial={onStartTrial}
        />
      </form>
    </section>
  );
};
