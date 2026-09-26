'use client';

import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RelativeTime, SectionHeader } from '@/ui-kit';

import type { LatestVideosProps } from './LatestVideos.types';

import { STREAMER_PAGE } from '../../../config';

import s from './LatestVideos.module.scss';

export const LatestVideos = ({ videos }: LatestVideosProps) => {
  const t = useTranslations('streamersDirectory.public.videos');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} />
      <ul className={s.list}>
        {videos.map((video) => (
          <li key={video.id} className={s.item}>
            <a className={s.link} href={video.url} rel='noopener noreferrer' target='_blank'>
              <Play aria-hidden className={s.icon} size={STREAMER_PAGE.iconSize} />
              <span className={s.title}>{video.title}</span>
            </a>
            <RelativeTime className={s.date} value={video.publishedAt} />
          </li>
        ))}
      </ul>
    </section>
  );
};
