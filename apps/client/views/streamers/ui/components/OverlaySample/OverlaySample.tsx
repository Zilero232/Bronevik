'use client';

import { useTranslations } from 'next-intl';

import { OverlayBoard } from '@/entities/streamer/overlay';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useOverlaySample } from '../../../model/hooks';

import s from './OverlaySample.module.scss';

export const OverlaySample = () => {
  const t = useTranslations('streamers.sample');
  const { data, nickname, isEmpty, isError, isRetrying, retry } = useOverlaySample();

  return (
    <figure className={s.root}>
      <div className={s.screen} data-theme='dark'>
        <div aria-hidden className={s.scene} />
        <div aria-hidden className={s.scanlines} />
        {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
        {!isError && isEmpty && <EmptyState isCompact title={t('empty')} />}
        {!isError && !isEmpty && !data && <Skeleton height={160} shape='block' />}
        {!isError && data && <OverlayBoard className={s.board} config={data.config} data={data} />}
      </div>
      <figcaption className={s.caption}>{nickname ? t('caption', { nickname }) : t('captionPending')}</figcaption>
    </figure>
  );
};
