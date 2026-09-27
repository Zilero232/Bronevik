'use client';

import type { OverlayMetric } from '@otmetki/schemas';

import { overlayMetricSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField, ToggleChips } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { OVERLAY_EDITOR } from '../../../config';

export const OverlayMetricsField = () => {
  const t = useTranslations('streamer.overlays');
  const tMetric = useTranslations('overlay.metric');
  const {
    control,
    formState: { errors }
  } = useFormContext<OverlayFormValues>();

  const options = overlayMetricSchema.options.map((metric) => ({ value: metric, label: tMetric(metric) }));

  return (
    <FormField
      error={errors.config?.metrics && t('errors.metrics', { max: OVERLAY_EDITOR.maxMetrics })}
      hint={t('fields.metricsHint', { max: OVERLAY_EDITOR.maxMetrics })}
      label={t('fields.metrics')}
    >
      <Controller
        render={({ field }) => (
          <ToggleChips<OverlayMetric>
            aria-label={t('fields.metrics')}
            options={options}
            size='sm'
            value={field.value}
            onChange={(next) => field.onChange(next.slice(0, OVERLAY_EDITOR.maxMetrics))}
          />
        )}
        control={control}
        name='config.metrics'
      />
    </FormField>
  );
};
