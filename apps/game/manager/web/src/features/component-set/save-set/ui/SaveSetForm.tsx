import { Save } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, FormField, TextInput } from '@/ui-kit';

import type { SaveSetFormProps } from './SaveSetForm.types';

import { useSaveSetForm } from '../model/hooks';

import s from './SaveSetForm.module.scss';

export const SaveSetForm = ({ components, disabled }: SaveSetFormProps) => {
  const t = useTranslations('sets');
  const { register, error, isPending, onSubmit } = useSaveSetForm(components);

  return (
    <form className={s.root} onSubmit={onSubmit}>
      <FormField error={error} hint={t('saveHint', { count: components.length })} label={t('name')}>
        {(control) => <TextInput {...control} {...register('name')} autoComplete='off' disabled={disabled} placeholder={t('namePlaceholder')} />}
      </FormField>
      <Button disabled={disabled} isPending={isPending} type='submit'>
        <Save aria-hidden />
        {t('save')}
      </Button>
    </form>
  );
};
