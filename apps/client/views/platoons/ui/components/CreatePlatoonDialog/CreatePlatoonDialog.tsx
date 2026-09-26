'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { FormDialog } from '@/features/community/form-dialog';
import { AccountSelect } from '@/features/community/viewer';
import { FormField, Switch, Textarea } from '@/ui-kit';

import { PLATOON_FORM } from '../../../config';
import { useCreatePlatoonForm } from '../../../model/hooks';
import { PlatoonScopeFields, PlatoonTanksField, PlatoonWindowFields } from './components';

import s from './CreatePlatoonDialog.module.scss';

export const CreatePlatoonDialog = () => {
  const t = useTranslations('platoons.create');
  const id = useId();
  const { form, isOpen, isPending, onOpenChange, onSubmit } = useCreatePlatoonForm();
  const { errors } = form.formState;

  return (
    <FormDialog
      trigger={
        <>
          <Plus size={14} />
          {t('open')}
        </>
      }
      cancelLabel={t('cancel')}
      description={t('description')}
      form={form}
      isOpen={isOpen}
      isPending={isPending}
      submitLabel={t('submit')}
      title={t('title')}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    >
      <Controller control={form.control} name='accountId' render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />} />
      <PlatoonScopeFields />
      <PlatoonTanksField />
      <PlatoonWindowFields />
      <Controller
        control={form.control}
        name='hasVoice'
        render={({ field }) => <Switch checked={field.value} label={t('voice')} onCheckedChange={field.onChange} />}
      />
      <FormField error={errors.message && t('messageError')} htmlFor={`${id}-message`} label={t('message')}>
        <Textarea
          id={`${id}-message`}
          isInvalid={Boolean(errors.message)}
          placeholder={t('messagePlaceholder')}
          rows={PLATOON_FORM.messageRows}
          {...form.register('message')}
        />
      </FormField>
      <p className={s.note}>{t('replaceNote')}</p>
    </FormDialog>
  );
};
