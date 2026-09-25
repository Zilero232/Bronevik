'use client';

import { API_KEY } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { createApiKey } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';
import { Button, buttonVariants, DialogClose, DialogFooter, Input, Select } from '@/ui-kit';

import type { CreateKeyFormValues, KeyExpiry } from '../../../../../lib/key-form';
import type { CreateKeyFormProps } from './CreateKeyForm.types';

import { createKeyFormSchema, KEY_EXPIRY, toCreateApiKeyInput } from '../../../../../lib/key-form';
import { useDeveloperMutation } from '../../../../../model/hooks';
import { FormField } from '../../../FormField';

import s from './CreateKeyForm.module.scss';

const DEFAULT_VALUES: CreateKeyFormValues = { name: '', expiry: KEY_EXPIRY.initial };

export const CreateKeyForm = ({ onCreated }: CreateKeyFormProps) => {
  const t = useTranslations('developer.createKey');
  const create = useDeveloperMutation({
    mutationFn: createApiKey,
    invalidates: [QUERY_KEYS.me.developer.keys],
    successKey: 'keyCreated',
    isErrorToasted: false
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError
  } = useForm<CreateKeyFormValues>({ resolver: zodResolver(createKeyFormSchema), defaultValues: DEFAULT_VALUES });

  const onSubmit = handleSubmit(async (values) => {
    try {
      onCreated(await create.mutateAsync(toCreateApiKeyInput({ ...values, now: new Date() })));
    } catch {
      setError('root.server', { message: 'server' });
    }
  });

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
