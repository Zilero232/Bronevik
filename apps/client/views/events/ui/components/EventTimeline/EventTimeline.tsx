import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, EmptyState } from '@/ui-kit';

import type { EventTimelineProps } from './EventTimeline.types';

import { EVENTS } from '../../../config';

import s from './EventTimeline.module.scss';

export const EventTimeline = ({ weeks, emptyTitle }: EventTimelineProps) => {
  const t = useTranslations('events');
  const format = useFormatter();

  if (weeks.length === 0) {
    return <EmptyState isCompact title={emptyTitle} />;
  }

  return (
    <div className={s.root}>
      {weeks.map(({ week, entries }) => (
        <section key={week} className={s.week}>
          <h3 className={s.weekTitle}>{t('timeline.week', { date: format.dateTime(new Date(week), { day: 'numeric', month: 'long' }) })}</h3>
          <ol className={s.list}>
            {entries.map(({ event, href, days }) => (
              <li key={event.id} className={s.node} data-kind={event.kind}>
                <time className={s.date} dateTime={event.startsAt}>
                  {format.dateTime(new Date(event.startsAt), { day: 'numeric', month: 'short' })}
                </time>
                <span aria-hidden className={s.dot} />
                <div className={s.card}>
                  <div className={s.head}>
                    <Badge tone={EVENTS.kindTone[event.kind]}>{t(`kinds.${event.kind}`)}</Badge>
                    {days !== null && <span className={s.countdown}>{t('countdown.upcoming', { days })}</span>}
                  </div>
                  {href ? (
                    <a className={s.title} href={href} rel='noopener noreferrer' target='_blank'>
                      {event.title}
                      <ExternalLink aria-hidden size={12} />
                    </a>
                  ) : (
                    <span className={s.title}>{event.title}</span>
                  )}
                  {event.description && <p className={s.description}>{event.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};
