'use client';

import { API_KEY } from '@otmetki/schemas';
import { KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Button, buttonVariants, DialogClose, DialogFooter, Input, Select } from '@/ui-kit';

import type { KeyExpiry } from '../../../../../lib/key-form';
import type { CreateKeyFormProps } from './CreateKeyForm.types';

import { KEY_EXPIRY } from '../../../../../config';
import { useCreateKeyForm } from '../../../../../model/hooks';
import { FormField } from '../../../FormField';

import s from './CreateKeyForm.module.scss';

export const CreateKeyForm = ({ onCreated }: CreateKeyFormProps) => {
  const t = useTranslations('developer.createKey');
  const { control, errors, isSubmitting, register, onSubmit } = useCreateKeyForm({ onCreated });

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <FormField error={errors.name && t('errors.name', { max: API_KEY.maxNameLength })} hint={t('nameHint')} label={t('name')}>
        <Input isInvalid={Boolean(errors.name)} maxLength={API_KEY.maxNameLength} placeholder={t('namePlaceholder')} {...register('name')} />
      </FormField>
      <Controller
        render={({ field }) => (
          <Select<KeyExpiry>
            items={KEY_EXPIRY.options.map((value) => ({ value, label: t(`expiryOptions.${value}`) }))}
            label={t('expiry')}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='expiry'
      />
      {errors.root?.server && <p className={s.error}>{t('errors.server')}</p>}
      <DialogFooter>
        <DialogClose className={buttonVariants({ variant: 'ghost' })}>{t('cancel')}</DialogClose>
        <Button disabled={isSubmitting} type='submit'>
          <KeyRound size={16} />
          {t('submit')}
        </Button>
      </DialogFooter>
    </form>
  );
};
