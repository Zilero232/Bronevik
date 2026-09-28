'use client';

import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, Card, CardHeader } from '@/ui-kit';

import type { AnnouncementCardProps } from './AnnouncementCard.types';

import { TankChanges } from './components';

import s from './AnnouncementCard.module.scss';

export const AnnouncementCard = ({ announcement: { title, url, summary, isOfficial, publishedAt, tanks } }: AnnouncementCardProps) => {
  const t = useTranslations('supertest');
  const format = useFormatter();

  return (
    <Card padding='none'>
      <CardHeader
        meta={
          <span className={s.meta}>
            {format.dateTime(new Date(publishedAt), 'date')}
            {!isOfficial && <Badge tone='warning'>{t('card.unofficial')}</Badge>}
          </span>
        }
        title={
          <a className={s.title} href={url} rel='noopener noreferrer' target='_blank'>
            {title}
            <ExternalLink aria-hidden size={14} />
            <span className={s.srOnly}>{t('card.newTab')}</span>
          </a>
        }
      />
      <div className={s.body}>
        {summary && <p className={s.summary}>{summary}</p>}
        {tanks.map((tank) => (
          <TankChanges key={tank.key} tank={tank} />
        ))}
      </div>
    </Card>
  );
};
