'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, SectionHeader, StatList } from '@/ui-kit';

import type { WorkspaceOverviewProps } from './WorkspaceOverview.types';

import { CANDIDATE_STATUSES } from '../../../config';
import { EventCard } from '../EventCard';
import { WorkspaceReport } from './components';

import s from './WorkspaceOverview.module.scss';

export const WorkspaceOverview = ({ clanId, workspace, isOfficer, members }: WorkspaceOverviewProps) => {
  const t = useTranslations('clanWorkspace.overview');
  const tStatus = useTranslations('clanWorkspace.candidates');

  return (
    <div className={s.root}>
      {isOfficer && <WorkspaceReport clanId={clanId} />}
      <div className={s.grid}>
        <section aria-labelledby='workspace-upcoming' className={s.section}>
          <SectionHeader count={workspace.upcoming.length} id='workspace-upcoming' title={t('upcoming')} />
          {workspace.upcoming.length === 0 ? (
            <EmptyState isCompact description={isOfficer ? t('noUpcomingOfficer') : t('noUpcomingMember')} title={t('noUpcoming')} />
          ) : (
            <ul className={s.list}>
              {workspace.upcoming.map((event) => (
                <li key={event.id}>
                  <EventCard clanId={clanId} event={event} isOfficer={isOfficer} members={members} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className={s.section}>
          <StatList
            items={[
              { id: 'members', label: t('members'), value: workspace.membersCount, kind: 'count' },
              { id: 'role', label: t('yourRole'), value: t(`roles.${workspace.role}`), isHighlighted: true }
            ]}
            columns={1}
            title={t('clan')}
          />
          {isOfficer && (
            <StatList
              items={CANDIDATE_STATUSES.map((status) => ({
                id: status,
                label: tStatus(status),
                value: workspace.candidates[status] ?? 0,
                kind: 'count'
              }))}
              columns={1}
              title={t('recruits')}
            />
          )}
        </aside>
      </div>
    </div>
  );
};
