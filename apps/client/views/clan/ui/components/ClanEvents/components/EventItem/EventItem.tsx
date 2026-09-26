'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { EventItemProps } from './EventItem.types';

import s from './EventItem.module.scss';

export const EventItem = ({ event: { type, nickname, oldRole, newRole, occurredAt } }: EventItemProps) => {
  const t = useTranslations('clans');
  const format = useFormatter();

  return (
    <li className={s.root} data-type={type}>
      <time className={s.time} dateTime={occurredAt}>
        {format.dateTime(new Date(occurredAt), { hour: '2-digit', minute: '2-digit' })}
      </time>
      <p className={s.text}>
        {nickname ? (
          <Link className={s.nickname} href={ROUTES.player(nickname)}>
            {nickname}
          </Link>
        ) : (
          <span className={s.nickname}>{t('events.unknownPlayer')}</span>
        )}{' '}
        <span className={s.action}>{t(`events.types.${type}`)}</span>
        {oldRole && newRole && (
          <span className={s.roles}> {t('events.roleChange', { from: t(`roster.roles.${oldRole}`), to: t(`roster.roles.${newRole}`) })}</span>
        )}
      </p>
    </li>
  );
};
