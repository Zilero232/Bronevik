'use client';

import { MonitorPlay } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState } from '@/ui-kit';

import type { OverlayPreviewProps } from './OverlayPreview.types';

import { useOverlayPreviewSrc } from '../../../model/hooks';

import s from './OverlayPreview.module.scss';

export const OverlayPreview = ({ config, publicId, isDraft }: OverlayPreviewProps) => {
  const t = useTranslations('streamer.overlays.preview');
  const src = useOverlayPreviewSrc({ publicId, config });

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>
        <span className={s.rec} />
        {t('title')}
      </figcaption>
      <div className={s.screen}>
        {src ? (
          <iframe className={s.frame} src={src} title={t('frameTitle')} />
        ) : (
          <EmptyState description={t('needsSave')} icon={<MonitorPlay size={20} />} title={t('emptyTitle')} />
        )}
      </div>
      <p className={s.hint}>{isDraft && src ? t('draftHint') : t('hint')}</p>
    </figure>
  );
};
