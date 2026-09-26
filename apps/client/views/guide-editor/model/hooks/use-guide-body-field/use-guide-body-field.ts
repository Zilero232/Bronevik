'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import type { GuideFormOutput, GuideFormValues } from '../../../lib/guide-form';

import { GUIDE_FORM } from '../../../config';

export const useGuideBodyField = () => {
  const { control, register, formState } = useFormContext<GuideFormValues, unknown, GuideFormOutput>();
  const body = useWatch({ control, name: 'body' });

  return {
    body,
    hasPreview: body.trim() !== '',
    length: body.length,
    max: GUIDE_FORM.bodyMax,
    min: GUIDE_FORM.bodyMin,
    rows: GUIDE_FORM.bodyRows,
    isInvalid: Boolean(formState.errors.body),
    field: register('body')
  };
};
