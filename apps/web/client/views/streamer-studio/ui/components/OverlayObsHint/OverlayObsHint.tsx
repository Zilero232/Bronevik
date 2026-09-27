'use client';

import { useTranslations } from 'next-intl';

import { CopyField } from '@/ui-kit';

import type { OverlayObsHintProps } from './OverlayObsHint.types';

import { OBS_SIZE, OBS_STEPS } from '../../../config';

import s from './OverlayObsHint.module.scss';

export const OverlayObsHint = ({ publicUrl, layout }: OverlayObsHintProps) => {
  const t = useTranslations('streamer.overlays.obs');
  const { width, height } = OBS_SIZE[layout];

  return (
    <section className={s.root}>
      <CopyField label={t('url')} tone='accent' value={publicUrl} />
      <h4 className={s.title}>{t('title')}</h4>
      <ol className={s.steps}>
        {OBS_STEPS.map((step) => (
          <li key={step}>{t(`steps.${step}`, { width, height })}</li>
        ))}
      </ol>
    </section>
  );
};
