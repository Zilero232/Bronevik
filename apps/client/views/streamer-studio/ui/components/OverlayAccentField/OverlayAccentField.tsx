'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Switch } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';

import { OVERLAY_EDITOR } from '../../../config';

import s from './OverlayAccentField.module.scss';

export const OverlayAccentField = () => {
  const t = useTranslations('streamer.overlays');
  const { control, setValue } = useFormContext<OverlayFormValues>();
  const accentColor = useWatch({ control, name: 'config.accentColor' });
  const accentId = useId();

  const onAccentChange = (next: string | undefined) => setValue('config.accentColor', next, { shouldDirty: true, shouldValidate: true });

  return (
    <div className={s.root}>
      <Switch
        checked={accentColor !== undefined}
        description={t('fields.accentHint')}
        label={t('fields.accent')}
        onCheckedChange={(isOn) => onAccentChange(isOn ? OVERLAY_EDITOR.defaultAccent : undefined)}
      />
      {accentColor !== undefined && (
        <label className={s.picker} htmlFor={accentId}>
          <input className={s.swatch} id={accentId} type='color' value={accentColor} onChange={(event) => onAccentChange(event.target.value)} />
          <span className={s.hex}>{accentColor.toUpperCase()}</span>
        </label>
      )}
    </div>
  );
};
