'use client';

import { BellRing, Check, RefreshCw, Trash2, X } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, Button, ConfirmDialog, IconButton } from '@/ui-kit';

import type { EventCardProps } from './EventCard.types';

import { ATTENDANCE_STATUSES, ATTENDANCE_TONES, EVENT_KIND_TONES } from '../../../config';
import { useEventActions } from '../../../model/hooks';
import { AttendanceDialog, EditEventDialog } from './components';

import s from './EventCard.module.scss';

export const EventCard = ({ clanId, event, isOfficer, members }: EventCardProps) => {
  const t = useTranslations('clanWorkspace');
  const format = useFormatter();
  const actions = useEventActions({ clanId, event });

  return (
    <article className={s.root} data-kind={event.kind}>
      <header className={s.head}>
        <Badge shape='pill' tone={EVENT_KIND_TONES[event.kind]}>
          {t(`kinds.${event.kind}`)}
        </Badge>
        <h3 className={s.title}>{event.title}</h3>
        <time className={s.time} dateTime={event.startsAt}>
          {format.dateTime(new Date(event.startsAt), 'dateTime')}
          {event.endsAt && ` — ${format.dateTime(new Date(event.endsAt), 'time')}`}
        </time>
      </header>
      <p className={s.reminder}>
        <BellRing aria-hidden size={14} />
        {event.remindedAt
          ? t('events.reminderSent', { time: format.dateTime(new Date(event.remindedAt), 'dateTime') })
          : event.remindAt
            ? t('events.reminderAt', { time: format.dateTime(new Date(event.remindAt), 'dateTime') })
            : t('events.noReminder')}
      </p>
      <ul aria-label={t('attendance.summary')} className={s.counts}>
        {ATTENDANCE_STATUSES.filter((status) => actions.counts[status] > 0).map((status) => (
          <li key={status}>
            <Badge shape='pill' tone={ATTENDANCE_TONES[status]}>
              {t('attendance.count', { status: t(`attendance.statuses.${status}`), count: actions.counts[status] })}
            </Badge>
          </li>
        ))}
      </ul>
      <footer className={s.actions}>
        {!actions.hasStarted && (
          <div aria-label={t('events.rsvp')} className={s.rsvp} role='group'>
            <Button
              disabled={actions.isRsvpPending}
              size='sm'
              variant={actions.myStatus === 'confirmed' ? 'primary' : 'secondary'}
              onClick={() => actions.onRsvp('confirmed')}
            >
              <Check aria-hidden size={14} />
              {t('events.going')}
            </Button>
            <Button
              disabled={actions.isRsvpPending}
              size='sm'
              variant={actions.myStatus === 'declined' ? 'primary' : 'ghost'}
              onClick={() => actions.onRsvp('declined')}
            >
              <X aria-hidden size={14} />
              {t('events.notGoing')}
            </Button>
          </div>
        )}
        {isOfficer && (
          <div className={s.officer}>
            <EditEventDialog clanId={clanId} event={event} />
            <AttendanceDialog clanId={clanId} event={event} members={members} />
            {actions.hasStarted && (
              <IconButton aria-label={t('events.sync')} disabled={actions.isSyncing} size='sm' variant='outline' onClick={actions.onSync}>
                <RefreshCw size={14} />
              </IconButton>
            )}
            <ConfirmDialog
              trigger={
                <IconButton aria-label={t('events.remove')} size='sm' variant='ghost'>
                  <Trash2 size={14} />
                </IconButton>
              }
              cancelLabel={t('events.cancel')}
              confirmLabel={t('events.remove')}
              isPending={actions.isRemoving}
              title={t('events.removeTitle', { title: event.title })}
              tone='danger'
              onConfirm={actions.onRemove}
            />
          </div>
        )}
      </footer>
    </article>
  );
};
