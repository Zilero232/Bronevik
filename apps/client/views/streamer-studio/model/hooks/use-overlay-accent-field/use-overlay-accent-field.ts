'use client';

import type { ChangeEvent } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { OVERLAY_EDITOR } from '../../../config';

export const useOverlayAccentField = () => {
  const { control, setValue } = useFormContext<OverlayFormValues>();
  const accentColor = useWatch({ control, name: 'config.accentColor' });

  const setAccent = (next: string | undefined) => setValue('config.accentColor', next, { shouldDirty: true, shouldValidate: true });
  const onToggle = (isOn: boolean) => setAccent(isOn ? OVERLAY_EDITOR.defaultAccent : undefined);
  const onPick = (event: ChangeEvent<HTMLInputElement>) => setAccent(event.target.value);

  return { accentColor, onToggle, onPick };
};
