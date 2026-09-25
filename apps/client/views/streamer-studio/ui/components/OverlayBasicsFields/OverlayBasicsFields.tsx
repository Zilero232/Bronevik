'use client';

import type { OverlayKind } from '@bronevik/schemas';

import { overlayKindSchema } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Select } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { KIND_PRESETS } from '../../../config';
import { FormField } from '../FormField';

import s from './OverlayBasicsFields.module.scss';

export const OverlayBasicsFields = () => {
  const t = useTranslations('streamer.overlays');
  const {
    register,
    control,
    setValue,
    formState: { errors }
  } = useFormContext<OverlayFormValues>();

  const nameId = useId();

  const onKindChange = (kind: OverlayKind) => {
    setValue('kind', kind, { shouldDirty: true });

    if (kind !== 'custom') {
      setValue('config.metrics', [...KIND_PRESETS[kind]], { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div className={s.root}>
      <FormField error={errors.name && t('errors.name')} htmlFor={nameId} label={t('fields.name')}>
        <Input id={nameId} isInvalid={Boolean(errors.name)} {...register('name')} />
      </FormField>
      <Controller
        render={({ field }) => (
          <Select<OverlayKind>
            items={overlayKindSchema.options.map((kind) => ({ value: kind, label: t(`kind.${kind}`) }))}
            label={t('fields.kind')}
            value={field.value}
            onValueChange={onKindChange}
          />
        )}
        control={control}
        name='kind'
      />
    </div>
  );
};
