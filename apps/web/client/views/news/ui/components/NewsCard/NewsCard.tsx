import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankLink } from '@/entities/tank/tank';
import { Badge } from '@/ui-kit';

import type { NewsCardProps } from './NewsCard.types';

import { NEWS } from '../../../config';

import s from './NewsCard.module.scss';

export const NewsCard = ({ entry: { item, href, vehicles } }: NewsCardProps) => {
  const t = useTranslations('news');
  const format = useFormatter();

  return (
    <li className={s.root}>
      <div className={s.meta}>
        <time className={s.date} dateTime={item.publishedAt}>
          {format.dateTime(new Date(item.publishedAt), { dateStyle: 'medium' })}
        </time>
        <Badge tone={NEWS.kindTone[item.kind]}>{t(`filters.${item.kind}`)}</Badge>
        {item.gameVersion && <Badge tone='neutral'>{t('version', { version: item.gameVersion })}</Badge>}
      </div>
      {href ? (
        <a className={s.title} href={href} rel='noopener noreferrer' target='_blank'>
          {item.title}
          <ExternalLink aria-hidden className={s.icon} size={14} />
        </a>
      ) : (
        <span className={s.title}>{item.title}</span>
      )}
      {item.summary && <p className={s.summary}>{item.summary}</p>}
      {vehicles.length > 0 && (
        <ul aria-label={t('mentions')} className={s.tanks}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.tankId}>
              <TankLink vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
