'use client';

import { ArrowRight, UserMinus, UserPlus, UserRoundCog, UserX } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { EventItemProps } from './EventItem.types';

import s from './EventItem.module.scss';

const ICONS = {
  joined: UserPlus,
  left: UserMinus,
  kicked: UserX,
  role_changed: UserRoundCog
} as const;

export const EventItem = ({ event }: EventItemProps) => {
  const t = useTranslations('clans');
  const format = useFormatter();

  const { type, nickname, oldRole, newRole, occurredAt } = event;
  const Icon = ICONS[type];

  return (
    <li className={s.root} data-type={type}>
      <span aria-hidden className={s.icon}>
        <Icon size={15} />
      </span>
      <div className={s.body}>
        <p className={s.text}>
          {nickname ? (
            <Link className={s.nickname} href={ROUTES.player(nickname)}>
              {nickname}
            </Link>
          ) : (
            <span className={s.nickname}>{t('events.unknownPlayer')}</span>
          )}{' '}
          {t(`events.types.${type}`)}
        </p>
        {oldRole && newRole && (
          <p className={s.roles}>
            {t(`roster.roles.${oldRole}`)}
            <ArrowRight aria-label={t('events.to')} size={12} />
            <span className={s.newRole}>{t(`roster.roles.${newRole}`)}</span>
          </p>
        )}
      </div>
      <time className={s.time} dateTime={occurredAt}>
        {format.dateTime(new Date(occurredAt), { hour: '2-digit', minute: '2-digit' })}
      </time>
    </li>
  );
};
