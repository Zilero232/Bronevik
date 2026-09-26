'use client';

import type { OverlayKind } from '@otmetki/schemas';

import { useFormContext } from 'react-hook-form';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { KIND_PRESETS } from '../../../config';

export const useOverlayBasicsFields = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors }
  } = useFormContext<OverlayFormValues>();

  const onKindChange = (kind: OverlayKind) => {
    setValue('kind', kind, { shouldDirty: true });

    if (kind !== 'custom') {
      setValue('config.metrics', [...KIND_PRESETS[kind]], { shouldDirty: true, shouldValidate: true });
    }
  };

  return { register, control, hasNameError: Boolean(errors.name), onKindChange };
};
