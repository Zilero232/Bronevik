'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { quietHoursSchema } from '@otmetki/schemas';
import { useForm, useWatch } from 'react-hook-form';

import type { QuietHours } from '../../../lib/quiet-hours';
import type { UseQuietHoursFormInput } from './use-quiet-hours-form.types';

import { QUIET_HOURS } from '../../../config';
import { dayHours, formatHour } from '../../../lib/quiet-hours';

export const useQuietHoursForm = ({ range, onSave }: UseQuietHoursFormInput) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<QuietHours>({ resolver: zodResolver(quietHoursSchema), defaultValues: range });

  const [start, end] = useWatch({ control, name: QUIET_HOURS.fields });

  const isSameHour = start === end;

  return {
    control,
    fields: QUIET_HOURS.fields,
    draft: { start, end },
    hourItems: dayHours().map((hour) => ({ value: String(hour), label: formatHour(hour) })),
    isSameHour,
    isSaveDisabled: !isDirty || isSameHour,
    onSubmit: handleSubmit(onSave)
  };
};
