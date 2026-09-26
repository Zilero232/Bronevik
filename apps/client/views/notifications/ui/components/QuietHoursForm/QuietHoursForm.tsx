'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Button, Select } from '@/ui-kit';

import type { QuietHoursFormProps } from './QuietHoursForm.types';

import { useQuietHoursForm } from '../../../model/hooks';
import { QuietDial } from '../QuietDial';

import s from './QuietHoursForm.module.scss';

export const QuietHoursForm = ({ range, onSave }: QuietHoursFormProps) => {
  const t = useTranslations('notifications.quiet');
  const { control, fields, draft, hourItems, isSameHour, isSaveDisabled, onSubmit } = useQuietHoursForm({ range, onSave });

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <QuietDial range={draft} />
      <div className={s.fields}>
        {fields.map((field) => (
          <Controller
            key={field}
            render={({ field: { value, onChange } }) => (
              <div className={s.field}>
                <Select items={hourItems} label={t(field)} value={String(value)} onValueChange={(next) => onChange(Number(next))} />
              </div>
            )}
            control={control}
            name={field}
          />
        ))}
      </div>
      {isSameHour && (
        <p className={s.error} role='alert'>
          {t('sameHour')}
        </p>
      )}
      <Button disabled={isSaveDisabled} size='sm' type='submit'>
        <Check size={15} />
        {t('save')}
      </Button>
    </form>
  );
};
