'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { OverlayBoard } from '@/entities/streamer/overlay';
import { ErrorState, Skeleton } from '@/ui-kit';

import type { OverlayPreviewProps } from './OverlayPreview.types';

import { OVERLAY_EDITOR } from '../../../config';
import { useOverlayPreview } from '../../../model/hooks';

import s from './OverlayPreview.module.scss';

export const OverlayPreview = ({ accountId }: OverlayPreviewProps) => {
  const t = useTranslations('streamer.overlays.preview');
  const { data, config, isError, isFetching, onRetry } = useOverlayPreview({ accountId });

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>{t('title')}</figcaption>
      <div className={s.screen}>
        {match({ data, isError })
          .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={onRetry} />)
          .with({ data: P.nonNullable }, ({ data: overlayData }) => <OverlayBoard config={config} data={overlayData} />)
          .otherwise(() => (
            <Skeleton height={OVERLAY_EDITOR.previewHeight} shape='block' />
          ))}
      </div>
      <p className={s.hint}>{t('hint')}</p>
    </figure>
  );
};
