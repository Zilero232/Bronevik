'use client';

import { useTranslations } from 'next-intl';
import { Controller, FormProvider } from 'react-hook-form';

import { Button, FormField, Input, NumberField, Select } from '@/ui-kit';

import { CHALLENGE_FORM } from '../../../config';
import { useChallengeForm } from '../../../model/hooks';
import { ConditionBuilder } from '../ConditionBuilder';
import { ConditionSentenceText } from '../ConditionSentenceText';

import s from './ChallengeForm.module.scss';

export const ChallengeForm = () => {
  const t = useTranslations('streamer.challenges.form');
  const { form, round, condition, expiryFallback, isPending, onSubmit } = useChallengeForm();
  const { errors } = form.formState;

  return (
    <FormProvider {...form}>
      <form noValidate className={s.root} onSubmit={onSubmit}>
        <h3 className={s.title}>{t('heading')}</h3>
        <FormField error={errors.title && t('errors.title')} label={t('title')}>
          <Input
            isInvalid={Boolean(errors.title)}
            maxLength={CHALLENGE_FORM.titleMax}
            placeholder={t('titlePlaceholder')}
            {...form.register('title')}
          />
        </FormField>
        <ConditionBuilder key={round} />
        {condition && <ConditionSentenceText className={s.sentence} condition={condition} />}
        <div className={s.row}>
          <Controller
            render={({ field }) => (
              <NumberField
                label={t('amount')}
                min={1}
                step={CHALLENGE_FORM.amountStep}
                suffix={t('amountSuffix')}
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? 0)}
              />
            )}
            control={form.control}
            name='amount'
          />
          <Controller
            render={({ field }) => (
              <Select
                items={CHALLENGE_FORM.expiryMinutes.map((minutes) => ({ value: String(minutes), label: t('expiresOption', { minutes }) }))}
                label={t('expires')}
                value={String(field.value ?? expiryFallback)}
                onValueChange={(value) => field.onChange(Number(value))}
              />
            )}
            control={form.control}
            name='expiresInMinutes'
          />
        </div>
        {errors.amount && <p className={s.error}>{t('errors.amount')}</p>}
        <Button block disabled={isPending} type='submit'>
          {t('submit')}
        </Button>
      </form>
    </FormProvider>
  );
};
