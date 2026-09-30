'use client';

import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';

import { PLUS_CHECKOUT } from '../../../config';
import { usePlusCheckoutForm } from '../../../model/hooks';
import { CheckoutAction, PlanPicker, PlusIncludes, PromoField } from './components';

import s from './PlusCheckout.module.scss';

export const PlusCheckout = () => {
  const t = useTranslations('plus.checkout');
  const tBrand = useTranslations('brand');
  const { form, onSubmit } = usePlusCheckoutForm();

  return (
    <section aria-labelledby='plus-checkout-title' className={s.root} id={PLUS_CHECKOUT.anchor}>
      <header className={s.header}>
        <p className={s.eyebrow}>{tBrand('plus')}</p>
        <h2 className={s.title} id='plus-checkout-title'>
          {t('title')}
        </h2>
        <p className={s.lead}>{t('description')}</p>
      </header>
      <div className={s.layout}>
        <FormProvider {...form}>
          <form noValidate className={s.main} onSubmit={onSubmit}>
            <PlanPicker />
            <PromoField />
            <CheckoutAction />
          </form>
        </FormProvider>
        <PlusIncludes />
      </div>
    </section>
  );
};
