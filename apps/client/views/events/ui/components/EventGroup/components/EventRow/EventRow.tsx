import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, ProgressBar } from '@/ui-kit';

import type { EventRowProps } from './EventRow.types';

import { EVENTS } from '../../../../../config';

import s from './EventRow.module.scss';

export const EventRow = ({ entry: { event, href, phase, progress, days } }: EventRowProps) => {
  const t = useTranslations('events');
  const format = useFormatter();

  return (
    <li className={s.root} data-phase={phase}>
      <div className={s.main}>
        <div className={s.head}>
          <Badge tone={EVENTS.kindTone[event.kind]}>{t(`kinds.${event.kind}`)}</Badge>
          {href ? (
            <a className={s.title} href={href} rel='noopener noreferrer' target='_blank'>
              {event.title}
              <ExternalLink aria-hidden className={s.icon} size={12} />
            </a>
          ) : (
            <span className={s.title}>{event.title}</span>
          )}
        </div>
        {event.description && <p className={s.description}>{event.description}</p>}
      </div>
      <div className={s.when}>
        <span className={s.dates}>
          {event.endsAt
            ? format.dateTimeRange(new Date(event.startsAt), new Date(event.endsAt), { day: 'numeric', month: 'short' })
            : format.dateTime(new Date(event.startsAt), { day: 'numeric', month: 'short' })}
        </span>
        {days !== null && <span className={s.countdown}>{t(`countdown.${phase}`, { days })}</span>}
        {progress !== null && <ProgressBar className={s.progress} label={t('progress')} size='sm' tone='accent' value={Math.round(progress * 100)} />}
      </div>
    </li>
  );
};
