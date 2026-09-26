'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Switch } from '@/ui-kit';

import { useOverlayAccentField } from '../../../model/hooks';

import s from './OverlayAccentField.module.scss';

export const OverlayAccentField = () => {
  const t = useTranslations('streamer.overlays');
  const accentId = useId();
  const { accentColor, onToggle, onPick } = useOverlayAccentField();

  return (
    <div className={s.root}>
      <Switch checked={accentColor !== undefined} description={t('fields.accentHint')} label={t('fields.accent')} onCheckedChange={onToggle} />
      {accentColor !== undefined && (
        <label className={s.picker} htmlFor={accentId}>
          <input className={s.swatch} id={accentId} type='color' value={accentColor} onChange={onPick} />
          <span className={s.hex}>{accentColor.toUpperCase()}</span>
        </label>
      )}
    </div>
  );
};
