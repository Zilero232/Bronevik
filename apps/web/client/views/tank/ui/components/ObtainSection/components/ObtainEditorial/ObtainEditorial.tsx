'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { Badge } from '@/ui-kit';

import type { ObtainEditorialProps } from './ObtainEditorial.types';

import { OBTAIN_EDITORIAL } from '../../../../../config';

import s from './ObtainEditorial.module.scss';

export const ObtainEditorial = ({ items }: ObtainEditorialProps) => {
  const t = useTranslations('tank.obtain.editorial');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <h3 className={s.title}>{t('title')}</h3>
      <ul className={s.list}>
        {items.map(({ key, kind, title, href, missionHref, note, startsAt, endsAt, event }) => (
          <li key={key} className={s.item}>
            <div className={s.head}>
              <Badge tone={OBTAIN_EDITORIAL.kindTone[kind]}>{t(`kinds.${kind}`)}</Badge>
              {href ? (
                <a className={s.link} href={href} rel='noopener noreferrer' target='_blank'>
                  {title ?? t(`kinds.${kind}`)}
                </a>
              ) : (
                <span className={s.name}>{title ?? t(`kinds.${kind}`)}</span>
              )}
              {startsAt && (
                <span className={s.dates}>
                  {endsAt
                    ? format.dateTimeRange(new Date(startsAt), new Date(endsAt), OBTAIN_EDITORIAL.dateFormat)
                    : t('since', { date: format.dateTime(new Date(startsAt), OBTAIN_EDITORIAL.dateFormat) })}
                </span>
              )}
              {!startsAt && endsAt && (
                <span className={s.dates}>{t('until', { date: format.dateTime(new Date(endsAt), OBTAIN_EDITORIAL.dateFormat) })}</span>
              )}
            </div>
            {event && (
              <p className={s.meta}>
                {t('event')}{' '}
                {event.href ? (
                  <a className={s.link} href={event.href} rel='noopener noreferrer' target='_blank'>
                    {event.title}
                  </a>
                ) : (
                  event.title
                )}
              </p>
            )}
            {missionHref && (
              <Link className={s.meta} href={missionHref}>
                {t('mission')}
              </Link>
            )}
            {note && <p className={s.note}>{note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};
