'use client';

import type { CheckoutInput } from '@bronevik/schemas';

import { checkoutSchema, plusPlanSchema } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { SectionHeader, SegmentedControl } from '@/ui-kit';

import { PLUS_CHECKOUT } from '../../../config';
import { usePlusAccess, usePlusCheckout, usePlusOffers } from '../../../model/hooks';
import { CheckoutAction, PlanPrice, PromoField } from './components';

import s from './PlusCheckout.module.scss';

const DEFAULT_VALUES: CheckoutInput = { plan: PLUS_CHECKOUT.defaultPlan, promoCode: undefined };

export const PlusCheckout = () => {
  const t = useTranslations('plus.checkout');
  const { pricing, isPending } = usePlusOffers();
  const { isSignedIn, isPlus, isPending: isAccessPending } = usePlusAccess();
  const checkout = usePlusCheckout();
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues: DEFAULT_VALUES });

  const plan = useWatch({ control, name: 'plan' });

  const selected = pricing.find((offer) => offer.plan === plan) ?? null;
  const options = plusPlanSchema.options.map((value) => {
    const saving = pricing.find((offer) => offer.plan === value)?.savingPercent ?? 0;

    return {
      value,
      label: (
        <span className={s.option}>
          {t(`plans.${value}`)}
          {saving > 0 && <span className={s.saving}>{t('savingShort', { percent: saving })}</span>}
        </span>
      )
    };
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await checkout.mutateAsync(values);
    } catch {
      if (values.promoCode) {
        setError('promoCode', { type: 'server' });

        return;
      }

      toast.error(t('failed'));
    }
  });

  return (
    <section className={s.root} id={PLUS_CHECKOUT.anchor}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='02' title={t('title')} />
      <form noValidate className={s.panel} onSubmit={onSubmit}>
        <div className={s.head}>
          <span className={s.label}>{t('planLabel')}</span>
          <Controller
            control={control}
            name='plan'
            render={({ field }) => <SegmentedControl aria-label={t('planLabel')} options={options} value={field.value} onChange={field.onChange} />}
          />
        </div>
        <PlanPrice isPending={isPending} pricing={selected} />
        {isSignedIn && !isPlus && (
          <PromoField error={errors.promoCode} registration={register('promoCode', { setValueAs: (value: string) => value.trim() || undefined })} />
        )}
        <CheckoutAction
          isPending={isAccessPending}
          isPlus={isPlus}
          isSignedIn={isSignedIn}
          isSubmitting={isSubmitting || checkout.isPending || checkout.isSuccess}
        />
      </form>
    </section>
  );
};
