import { ExternalLink } from 'lucide-react';
import { useFormatter } from 'next-intl';

import type { NewsRowProps } from './NewsRow.types';

import s from './NewsRow.module.scss';

export const NewsRow = ({ item }: NewsRowProps) => {
  const format = useFormatter();

  return (
    <li className={s.root}>
      <time className={s.date} dateTime={item.publishedAt}>
        {format.dateTime(new Date(item.publishedAt), { day: '2-digit', month: '2-digit' })}
      </time>
      <a className={s.title} href={item.url} rel='noreferrer' target='_blank'>
        {item.title}
      </a>
      <ExternalLink aria-hidden className={s.icon} size={14} />
    </li>
  );
};
