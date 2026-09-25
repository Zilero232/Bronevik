'use client';

import { quietHoursSchema } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button, Select } from '@/ui-kit';

import type { QuietHours } from '../../../lib/quiet-hours';
import type { QuietHoursFormProps } from './QuietHoursForm.types';

import { formatHour, QUIET_DIAL } from '../../../lib/quiet-hours';
import { QuietDial } from '../QuietDial';

import s from './QuietHoursForm.module.scss';

const HOURS = Array.from({ length: QUIET_DIAL.hours }, (_, hour) => hour);
const FIELDS = ['start', 'end'] as const;

export const QuietHoursForm = ({ range, onSave }: QuietHoursFormProps) => {
  const t = useTranslations('notifications.quiet');
  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<QuietHours>({ resolver: zodResolver(quietHoursSchema), defaultValues: range });

  const [start, end] = useWatch({ control, name: FIELDS });

  const isSameHour = start === end;
  const items = HOURS.map((hour) => ({ value: String(hour), label: formatHour(hour) }));

  return (
    <form noValidate className={s.root} onSubmit={handleSubmit(onSave)}>
      <QuietDial range={{ start, end }} />
      <div className={s.fields}>
        {FIELDS.map((field) => (
          <Controller
            key={field}
            render={({ field: { value, onChange } }) => (
              <div className={s.field}>
                <Select items={items} label={t(field)} value={String(value)} onValueChange={(next) => onChange(Number(next))} />
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
      <Button disabled={!isDirty || isSameHour} size='sm' type='submit'>
        <Check size={15} />
        {t('save')}
      </Button>
    </form>
  );
};
