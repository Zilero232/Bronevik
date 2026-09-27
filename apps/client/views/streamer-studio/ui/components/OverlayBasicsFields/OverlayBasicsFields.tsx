'use client';

import type { OverlayKind } from '@otmetki/schemas';

import { overlayKindSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { FormField, Input, Select } from '@/ui-kit';

import { useOverlayBasicsFields } from '../../../model/hooks';

import s from './OverlayBasicsFields.module.scss';

export const OverlayBasicsFields = () => {
  const t = useTranslations('streamer.overlays');
  const nameId = useId();
  const { register, control, hasNameError, onKindChange } = useOverlayBasicsFields();

  return (
    <div className={s.root}>
      <FormField error={hasNameError && t('errors.name')} htmlFor={nameId} label={t('fields.name')}>
        <Input id={nameId} isInvalid={hasNameError} {...register('name')} />
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
