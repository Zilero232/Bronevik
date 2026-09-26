'use client';

import { COMPETITION, COMPETITION_MODES, COMPETITION_VISIBILITIES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField, Input, NumberField, Select } from '@/ui-kit';

import type { CompetitionFormOutput, CompetitionFormValues } from '../../../../../lib/competition-form';

import { COMPETITION_FORM } from '../../../../../config';

import s from './CompetitionRulesFields.module.scss';

export const CompetitionRulesFields = () => {
  const t = useTranslations('competitions');
  const id = useId();
  const { register, control, formState } = useFormContext<CompetitionFormValues, unknown, CompetitionFormOutput>();
  const { errors } = formState;

  return (
    <div className={s.root}>
      <Controller
        render={({ field }) => (
          <Select
            items={COMPETITION_MODES.map((mode) => ({ value: mode, label: t(`modes.${mode}`) }))}
            label={t('create.mode')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='mode'
      />
      <Controller
        render={({ field }) => (
          <Select
            items={COMPETITION_VISIBILITIES.map((visibility) => ({ value: visibility, label: t(`visibility.${visibility}`) }))}
            label={t('create.visibility')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='visibility'
      />
      <Controller
        render={({ field }) => (
          <Select
            items={[
              { value: COMPETITION_FORM.anyTier, label: t('create.anyTier') },
              ...COMPETITION_FORM.tiers.map((tier) => ({ value: String(tier), label: t('create.tier', { tier }) }))
            ]}
            label={t('create.minTier')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='minTier'
      />
      <Controller
        render={({ field }) => (
          <NumberField
            hint={errors.battlesPerPlayer ? t('create.battlesError', COMPETITION.battles) : t('create.battlesHint')}
            label={t('create.battles')}
            max={COMPETITION.battles.max}
            min={COMPETITION.battles.min}
            value={field.value}
            onValueChange={(value) => field.onChange(value ?? COMPETITION.battles.min)}
          />
        )}
        control={control}
        name='battlesPerPlayer'
      />
      <FormField error={errors.startsAt && t('create.startsAtError')} htmlFor={`${id}-starts`} label={t('create.startsAt')}>
        <Input id={`${id}-starts`} isInvalid={Boolean(errors.startsAt)} size='sm' type='datetime-local' {...register('startsAt')} />
      </FormField>
      <FormField
        error={errors.endsAt && t('create.endsAtError', { days: COMPETITION.maxDurationDays })}
        htmlFor={`${id}-ends`}
        label={t('create.endsAt')}
      >
        <Input id={`${id}-ends`} isInvalid={Boolean(errors.endsAt)} size='sm' type='datetime-local' {...register('endsAt')} />
      </FormField>
    </div>
  );
};
