'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormField, Input } from '@/ui-kit';

import { useRequirementsFields } from '../../model/hooks';

import s from './RequirementsFields.module.scss';

export const RequirementsFields = () => {
  const t = useTranslations('community.requirements.fields');
  const id = useId();
  const { fields } = useRequirementsFields();

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('legend')}</legend>
      <div className={s.grid}>
        {fields.map(({ key, field, isInvalid }) => (
          <FormField key={key} error={isInvalid && t('invalid')} htmlFor={`${id}-${key}`} label={t(key)}>
            <Input id={`${id}-${key}`} inputMode='decimal' isInvalid={isInvalid} placeholder={t('any')} size='sm' {...field} />
          </FormField>
        ))}
      </div>
    </fieldset>
  );
};
