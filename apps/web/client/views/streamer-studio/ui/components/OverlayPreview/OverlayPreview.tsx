'use client';

import { useTranslations } from 'next-intl';

import { OverlayBoard } from '@/entities/streamer/overlay';
import { QueryState, Skeleton } from '@/ui-kit';

import type { OverlayPreviewProps } from './OverlayPreview.types';

import { OVERLAY_EDITOR } from '../../../config';
import { useOverlayPreview } from '../../../model/hooks';

import s from './OverlayPreview.module.scss';

export const OverlayPreview = ({ accountId }: OverlayPreviewProps) => {
  const t = useTranslations('streamer.overlays.preview');
  const { query, config } = useOverlayPreview({ accountId });

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>{t('title')}</figcaption>
      <div className={s.screen}>
        <QueryState query={query} skeleton={<Skeleton height={OVERLAY_EDITOR.previewHeight} shape='block' />}>
          {(data) => <OverlayBoard config={config} data={data} />}
        </QueryState>
      </div>
      <p className={s.hint}>{t('hint')}</p>
    </figure>
  );
};
