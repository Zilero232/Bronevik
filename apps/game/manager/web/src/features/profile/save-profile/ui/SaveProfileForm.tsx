import { Save } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, FormField, TextInput } from '@/ui-kit';

import type { SaveProfileFormProps } from './SaveProfileForm.types';

import { useSaveProfileForm } from '../model/hooks';

import s from './SaveProfileForm.module.scss';

export const SaveProfileForm = ({ clientPath, disabled }: SaveProfileFormProps) => {
  const t = useTranslations('profiles');
  const { register, error, isPending, onSubmit } = useSaveProfileForm(clientPath);

  return (
    <form className={s.root} onSubmit={onSubmit}>
      <FormField error={error} label={t('name')}>
        {(control) => <TextInput {...control} {...register('name')} autoComplete='off' disabled={disabled} placeholder={t('namePlaceholder')} />}
      </FormField>
      <Button disabled={disabled} isPending={isPending} type='submit'>
        <Save aria-hidden />
        {t('save')}
      </Button>
    </form>
  );
};
