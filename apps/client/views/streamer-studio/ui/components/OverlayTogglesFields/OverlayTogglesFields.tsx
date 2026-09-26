'use client';

import type { OverlayConfig } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { OVERLAY_OPTIONS } from '@/entities/streamer/overlay';
import { LOCALE_LABELS } from '@/shared/i18n';
import { SegmentedControl, Select, Switch } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { FormField } from '../FormField';
import { OverlayAccentField } from '../OverlayAccentField';

import s from './OverlayTogglesFields.module.scss';

export const OverlayTogglesFields = () => {
  const t = useTranslations('streamer.overlays');
  const { control } = useFormContext<OverlayFormValues>();

  return (
    <div className={s.root}>
      <OverlayAccentField />
      <Controller
        render={({ field }) => (
          <Switch checked={field.value} description={t('fields.animateHint')} label={t('fields.animate')} onCheckedChange={field.onChange} />
        )}
        control={control}
        name='config.animate'
      />
      <Controller
        render={({ field }) => (
          <Switch checked={field.value} description={t('fields.showTankHint')} label={t('fields.showTank')} onCheckedChange={field.onChange} />
        )}
        control={control}
        name='config.showTank'
      />
      <div className={s.pair}>
        <Controller
          render={({ field }) => (
            <Select<OverlayConfig['resetAt']>
              items={OVERLAY_OPTIONS.resets.map((reset) => ({ value: reset, label: t(`reset.${reset}`) }))}
              label={t('fields.reset')}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
          control={control}
          name='config.resetAt'
        />
        <FormField label={t('fields.locale')}>
          <Controller
            render={({ field }) => (
              <SegmentedControl<OverlayConfig['locale']>
                aria-label={t('fields.locale')}
                options={OVERLAY_OPTIONS.locales.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] }))}
                size='sm'
                value={field.value}
                onChange={field.onChange}
              />
            )}
            control={control}
            name='config.locale'
          />
        </FormField>
      </div>
    </div>
  );
};
