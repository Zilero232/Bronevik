'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { FormDialog } from '@/features/community/form-dialog';
import { RequirementsFields } from '@/features/community/stat-requirements';
import { FormField, Input, Select, Textarea } from '@/ui-kit';

import type { CreateRecruitingDialogProps } from './CreateRecruitingDialog.types';

import { RECRUITING_BOARD } from '../../../config';
import { useCreateRecruitingForm } from '../../../model/hooks';
import { RecruitingAuthorField } from './components';

export const CreateRecruitingDialog = ({ kind }: CreateRecruitingDialogProps) => {
  const t = useTranslations('recruiting.create');
  const id = useId();
  const { dialog, isClan, officers, canSubmit, isClansPending } = useCreateRecruitingForm(kind);
  const { form } = dialog;
  const { errors } = form.formState;

  return (
    <FormDialog canSubmit={canSubmit} dialog={dialog} namespace={`recruiting.create.dialog.${kind}`} triggerIcon={Plus}>
      <RecruitingAuthorField isClan={isClan} isClansPending={isClansPending} officers={officers} />
      <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('postTitle')}>
        <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} placeholder={t(`titlePlaceholder.${kind}`)} {...form.register('title')} />
      </FormField>
      <FormField error={errors.body && t('bodyError')} htmlFor={`${id}-body`} label={t('body')}>
        <Textarea
          id={`${id}-body`}
          isInvalid={Boolean(errors.body)}
          placeholder={t(`bodyPlaceholder.${kind}`)}
          rows={RECRUITING_BOARD.bodyRows}
          {...form.register('body')}
        />
      </FormField>
      {isClan && <RequirementsFields />}
      <Controller
        render={({ field }) => (
          <Select
            items={RECRUITING_BOARD.expiresOptions.map((days) => ({ value: String(days), label: t('days', { count: days }) }))}
            label={t('expiresIn')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={form.control}
        name='expiresInDays'
      />
    </FormDialog>
  );
};
