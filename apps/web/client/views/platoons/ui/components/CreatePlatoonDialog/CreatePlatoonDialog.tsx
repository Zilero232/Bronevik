'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { AccountSelect } from '@/entities/auth/session';
import { FormDialog } from '@/features/community/form-dialog';
import { FormField, Switch, Textarea } from '@/ui-kit';

import { PLATOON_FORM } from '../../../config';
import { useCreatePlatoonForm } from '../../../model/hooks';
import { PlatoonScopeFields, PlatoonTanksField, PlatoonWindowFields } from './components';

import s from './CreatePlatoonDialog.module.scss';

export const CreatePlatoonDialog = () => {
  const t = useTranslations('platoons.create');
  const id = useId();
  const dialog = useCreatePlatoonForm();
  const { form } = dialog;
  const { errors } = form.formState;

  return (
    <FormDialog dialog={dialog} namespace='platoons.create' triggerIcon={Plus}>
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
