'use client';

import { challengeConditionSchema, createChallengeSchema } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Swords } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, Input, NumberField, Select } from '@/ui-kit';

import type { ChallengeFormOutput, ChallengeFormValues } from '../../../model/studio.types';

import { CHALLENGE_FORM, CHALLENGE_FORM_DEFAULTS } from '../../../config';
import { useCreateChallenge } from '../../../model/hooks';
import { ConditionBuilder } from '../ConditionBuilder';
import { ConditionSentenceText } from '../ConditionSentenceText';
import { FormField } from '../FormField';

import s from './ChallengeForm.module.scss';

export const ChallengeForm = () => {
  const t = useTranslations('streamer.challenges.form');
  const create = useCreateChallenge();
  const [round, setRound] = useState(0);
  const form = useForm<ChallengeFormValues, unknown, ChallengeFormOutput>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: CHALLENGE_FORM_DEFAULTS
  });

  const condition = useWatch({ control: form.control, name: 'condition' });
  const {
    formState: { errors }
  } = form;

  const parsed = challengeConditionSchema.safeParse(condition);

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(values, {
      onSuccess: () => {
        form.reset(CHALLENGE_FORM_DEFAULTS);
        setRound((value) => value + 1);
      }
    })
  );

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
        {parsed.success && <ConditionSentenceText className={s.sentence} condition={parsed.data} />}
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
                value={String(field.value ?? CHALLENGE_FORM_DEFAULTS.expiresInMinutes)}
                onValueChange={(value) => field.onChange(Number(value))}
              />
            )}
            control={form.control}
            name='expiresInMinutes'
          />
        </div>
        {errors.amount && <p className={s.error}>{t('errors.amount')}</p>}
        <Button block disabled={create.isPending} type='submit'>
          <Swords size={16} />
          {t('submit')}
        </Button>
      </form>
    </FormProvider>
  );
};
