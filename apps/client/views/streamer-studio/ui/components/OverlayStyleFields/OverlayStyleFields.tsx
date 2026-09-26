'use client';

import type { OverlayConfig } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { OVERLAY_OPTIONS } from '@/entities/streamer/overlay';
import { PlusBadge } from '@/features/plus/plus-gate';
import { RangeSlider, SegmentedControl } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { OVERLAY_EDITOR } from '../../../config';
import { useOverlayThemes } from '../../../model/hooks';
import { FormField } from '../FormField';

import s from './OverlayStyleFields.module.scss';

export const OverlayStyleFields = () => {
  const t = useTranslations('streamer.overlays');
  const format = useFormatter();
  const { control } = useFormContext<OverlayFormValues>();
  const { isPlus, standard, premium } = useOverlayThemes();

  return (
    <div className={s.root}>
      <FormField label={t('fields.theme')}>
        <Controller
          render={({ field }) => (
            <SegmentedControl<OverlayConfig['theme']>
              aria-label={t('fields.theme')}
              options={standard}
              size='sm'
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='config.theme'
        />
      </FormField>
      <FormField
        label={
          <span className={s.premiumLabel}>
            {t('premiumThemes')}
            {!isPlus && <PlusBadge />}
          </span>
        }
        hint={t('premiumThemesHint')}
      >
        {isPlus && (
          <Controller
            render={({ field }) => (
              <SegmentedControl<OverlayConfig['theme']>
                aria-label={t('premiumThemes')}
                options={premium}
                size='sm'
                value={field.value}
                onChange={field.onChange}
              />
            )}
            control={control}
            name='config.theme'
          />
        )}
      </FormField>
      <FormField label={t('fields.layout')}>
        <Controller
          render={({ field }) => (
            <SegmentedControl<OverlayConfig['layout']>
              aria-label={t('fields.layout')}
              options={OVERLAY_OPTIONS.layouts.map((layout) => ({ value: layout, label: t(`layout.${layout}`) }))}
              size='sm'
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='config.layout'
        />
      </FormField>
      <Controller
        render={({ field }) => (
          <RangeSlider
            label={t('fields.fontScale')}
            max={OVERLAY_EDITOR.fontScale.max}
            min={OVERLAY_EDITOR.fontScale.min}
            step={OVERLAY_EDITOR.fontScale.step}
            value={field.value}
            valueLabel={`×${format.number(field.value, { maximumFractionDigits: 1 })}`}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name='config.fontScale'
      />
    </div>
  );
};
