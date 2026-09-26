'use client';

import { ChevronRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { percentText } from '@/shared/lib';
import { Badge, Skeleton } from '@/ui-kit';

import type { SessionCardProps } from './SessionCard.types';

import { openExternally } from '../../../lib/open-externally';

import s from './SessionCard.module.scss';

export const SessionCard = ({ nickname, session }: SessionCardProps) => {
  const t = useTranslations('tg.session');
  const format = useFormatter();

  return match(session)
    .with(undefined, () => <Skeleton height={140} shape='block' />)
    .with(null, () => <p className={s.empty}>{t('empty')}</p>)
    .with(P.nonNullable, ({ id, isLive, startedAt, stats }) => (
      <Link className={s.root} href={ROUTES.playerSession({ nickname, sessionId: id })} onClick={openExternally}>
        <header className={s.header}>
          <span className={s.title}>{isLive ? t('live') : t('last')}</span>
          {isLive ? (
            <Badge tone='success'>{t('liveBadge')}</Badge>
          ) : (
            <time className={s.time} dateTime={startedAt}>
              {format.dateTime(new Date(startedAt), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </time>
          )}
        </header>
        <dl className={s.stats}>
          <div className={s.stat}>
            <dt>{t('battles')}</dt>
            <dd>{format.number(stats.battles)}</dd>
          </div>
          <div className={s.stat} data-tone={winRateTone(stats.winRate)}>
            <dt>{t('winRate')}</dt>
            <dd>{percentText({ format, value: stats.winRate, digits: 1 })}</dd>
          </div>
          <div className={s.stat}>
            <dt>{t('avgDamage')}</dt>
            <dd>{stats.avgDamage === null ? '—' : format.number(Math.round(stats.avgDamage))}</dd>
          </div>
          <div className={s.stat} data-tone={ratingValueTone(stats.wn8)}>
            <dt>WN8</dt>
            <dd>{stats.wn8.value === null ? '—' : format.number(Math.round(stats.wn8.value))}</dd>
          </div>
        </dl>
        <span className={s.more}>
          {t('details')}
          <ChevronRight size={14} />
        </span>
      </Link>
    ))
    .exhaustive();
};
