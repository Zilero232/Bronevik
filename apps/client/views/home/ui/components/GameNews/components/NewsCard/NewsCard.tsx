import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import type { NewsCardProps } from './NewsCard.types';

import { HOME_ICON, NEWS_KIND_ICON } from '../../../../../config';

import s from './NewsCard.module.scss';

export const NewsCard = ({ item }: NewsCardProps) => {
  const t = useTranslations('home.news');
  const format = useFormatter();
  const Emblem = NEWS_KIND_ICON[item.kind];

  return (
    <a className={s.root} data-kind={item.kind} href={item.url} rel='noreferrer' target='_blank'>
      <span aria-hidden className={s.media}>
        <Emblem className={s.emblem} size={HOME_ICON.emblem} strokeWidth={1} />
        {item.gameVersion && <span className={s.version}>{item.gameVersion}</span>}
      </span>
      <span className={s.plate}>
        <span className={s.kind}>{t(`kinds.${item.kind}`)}</span>
        <time className={s.date} dateTime={item.publishedAt}>
          {format.dateTime(new Date(item.publishedAt), { day: 'numeric', month: 'long' })}
        </time>
      </span>
      <span className={s.title}>
        {item.title}
        <ExternalLink aria-hidden className={s.icon} size={12} />
      </span>
    </a>
  );
};
