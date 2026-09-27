'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import type { WorkspaceEventsProps } from './WorkspaceEvents.types';

import { WORKSPACE_VIEW } from '../../../config';
import { useWorkspaceEvents } from '../../../model/hooks';
import { EventCard } from '../EventCard';
import { CreateEventDialog } from './components';

import s from './WorkspaceEvents.module.scss';

export const WorkspaceEvents = ({ clanId, isOfficer, members }: WorkspaceEventsProps) => {
  const t = useTranslations('clanWorkspace.events');
  const { query, upcoming, past } = useWorkspaceEvents({ clanId, isEnabled: true });

  return (
    <div className={s.root}>
      <SectionHeader
        action={isOfficer && <CreateEventDialog clanId={clanId} />}
        count={upcoming.length}
        id='workspace-events'
        title={t('upcoming')}
      />
      <QueryState
        empty={<EmptyState description={isOfficer ? t('emptyOfficer') : t('emptyMember')} title={t('empty')} />}
        errorTitle={t('error')}
        isEmpty={(events) => events.length === 0}
        query={query}
        skeleton={<Skeleton height={WORKSPACE_VIEW.skeletonHeight} shape='block' />}
      >
        {upcoming.length === 0 ? (
          <EmptyState isCompact title={t('noUpcoming')} />
        ) : (
          <ul className={s.list}>
            {upcoming.map((event) => (
              <li key={event.id}>
                <EventCard clanId={clanId} event={event} isOfficer={isOfficer} members={members} />
              </li>
            ))}
          </ul>
        )}
        {past.length > 0 && (
          <section aria-labelledby='workspace-past' className={s.root}>
            <SectionHeader count={past.length} id='workspace-past' meta={t('pastMeta', { days: WORKSPACE_VIEW.historyDays })} title={t('past')} />
            <ul className={s.list}>
              {past.map((event) => (
                <li key={event.id}>
                  <EventCard clanId={clanId} event={event} isOfficer={isOfficer} members={members} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </QueryState>
    </div>
  );
};
