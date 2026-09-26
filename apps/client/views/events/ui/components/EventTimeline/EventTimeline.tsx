import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, EmptyState, Timeline } from '@/ui-kit';

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
          <Timeline
            items={entries.map(({ event, href, days }) => ({
              id: event.id,
              tone: EVENTS.kindTone[event.kind],
              date: format.dateTime(new Date(event.startsAt), { day: 'numeric', month: 'short' }),
              dateTime: event.startsAt,
              content: (
                <>
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
                </>
              )
            }))}
            variant='card'
          />
        </section>
      ))}
    </div>
  );
};
