import { useTranslations } from 'use-intl';

import { NameForm } from '@/ui-kit';

import type { SaveSetFormProps } from './SaveSetForm.types';

import { useSaveSetForm } from '../model/hooks';

import s from './SaveSetForm.module.scss';

export const SaveSetForm = ({ components, disabled }: SaveSetFormProps) => {
  const t = useTranslations('sets');
  const { field, error, isPending, onSubmit } = useSaveSetForm(components);

  return (
    <NameForm
      className={s.root}
      disabled={disabled}
      error={error}
      field={field}
      hint={t('saveHint', { count: components.length })}
      isPending={isPending}
      label={t('name')}
      placeholder={t('namePlaceholder')}
      submitLabel={t('save')}
      onSubmit={onSubmit}
    />
  );
};
