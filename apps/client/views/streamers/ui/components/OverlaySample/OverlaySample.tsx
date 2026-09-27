'use client';

import { useTranslations } from 'next-intl';

import { OverlayBoard } from '@/entities/streamer/overlay';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useOverlaySample } from '../../../model/hooks';

import s from './OverlaySample.module.scss';

export const OverlaySample = () => {
  const t = useTranslations('streamers.sample');
  const { nickname, query } = useOverlaySample();

  return (
    <figure className={s.root}>
      <div className={s.screen} data-theme='dark'>
        <div aria-hidden className={s.scene} />
        <div aria-hidden className={s.scanlines} />
        <QueryState
          isCompact
          empty={<EmptyState isCompact title={t('empty')} />}
          isEmpty={(data) => data === null}
          query={query}
          skeleton={<Skeleton height={160} shape='block' />}
        >
          {(data) => data && <OverlayBoard className={s.board} config={data.config} data={data} />}
        </QueryState>
      </div>
      <figcaption className={s.caption}>{nickname ? t('caption', { nickname }) : t('captionPending')}</figcaption>
    </figure>
  );
};
