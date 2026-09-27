'use client';

import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';

import { SectionHeader } from '@/ui-kit';

import { PLUS_CHECKOUT } from '../../../config';
import { usePlusCheckoutForm } from '../../../model/hooks';
import { CheckoutAction, PlanTable, PromoField } from './components';

import s from './PlusCheckout.module.scss';

export const PlusCheckout = () => {
  const t = useTranslations('plus.checkout');
  const { form, onSubmit } = usePlusCheckoutForm();

  return (
    <section className={s.root} id={PLUS_CHECKOUT.anchor}>
      <SectionHeader description={t('description')} title={t('title')} />
      <FormProvider {...form}>
        <form noValidate className={s.panel} onSubmit={onSubmit}>
          <PlanTable />
          <PromoField />
          <CheckoutAction />
        </form>
      </FormProvider>
    </section>
  );
};
