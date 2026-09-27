'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import type { SpottingFormValues } from '../../../lib/spotting-form';

import { SPOTTING_FORM_DEFAULTS } from '../../../config';
import { spottingFormSchema } from '../../../lib/spotting-form';

export const useSpottingForm = () => {
  const form = useForm<SpottingFormValues>({
    resolver: zodResolver(spottingFormSchema),
    defaultValues: SPOTTING_FORM_DEFAULTS,
    mode: 'onChange'
  });

  const [targetId, me, them] = useWatch({ control: form.control, name: ['targetId', 'me', 'them'] });

  return { form, values: { targetId, me, them } satisfies SpottingFormValues };
};
