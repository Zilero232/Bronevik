'use client';

import { CalendarClock, ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ProgressBar } from '@/ui-kit';

import type { NowCardProps } from './NowCard.types';

import { useEventCountdown } from '../../../model/hooks';

import s from './NowCard.module.scss';

export const NowCard = ({ entry: { event, href, progress } }: NowCardProps) => {
  const t = useTranslations('events');
  const format = useFormatter();
  const left = useEventCountdown({ endsAt: event.endsAt });

  return (
    <article className={s.root} data-kind={event.kind}>
      <div className={s.media}>
        <CalendarClock aria-hidden className={s.glyph} size={160} strokeWidth={1.25} />
        <span className={s.plate}>{t(`kinds.${event.kind}`)}</span>
      </div>
      <div className={s.body}>
        <h3 className={s.title}>
          {href ? (
            <a className={s.link} href={href} rel='noopener noreferrer' target='_blank'>
              {event.title}
              <ExternalLink aria-hidden size={14} />
            </a>
          ) : (
            event.title
          )}
        </h3>
        {event.description && <p className={s.description}>{event.description}</p>}
        <div className={s.footer}>
          {left ? (
            <p className={s.countdown}>
              <span className={s.countdownLabel}>{t('now.endsIn')}</span>
              <span className={s.countdownValue}>{t('now.left', left)}</span>
            </p>
          ) : (
            <p className={s.countdown}>
              <span className={s.countdownLabel}>{t('now.since')}</span>
              <span className={s.countdownValue}>{format.dateTime(new Date(event.startsAt), { day: 'numeric', month: 'short' })}</span>
            </p>
          )}
          {progress !== null && (
            <ProgressBar className={s.progress} label={t('progress')} size='sm' tone='accent' value={Math.round(progress * 100)} />
          )}
        </div>
      </div>
    </article>
  );
};
