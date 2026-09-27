'use client';

import { useTranslations } from 'next-intl';

import { Tabs } from '@/ui-kit';

import type { WorkspaceTabsProps } from './WorkspaceTabs.types';

import { WorkspaceCandidates } from '../WorkspaceCandidates';
import { WorkspaceEvents } from '../WorkspaceEvents';
import { WorkspaceOverview } from '../WorkspaceOverview';
import { WorkspaceRoster } from '../WorkspaceRoster';

export const WorkspaceTabs = ({ clanId, workspace, members, isOfficer, recruits, tab, onTabChange }: WorkspaceTabsProps) => {
  const t = useTranslations('clanWorkspace.tabs');

  return (
    <Tabs
      items={[
        {
          value: 'overview',
          label: t('overview'),
          content: <WorkspaceOverview clanId={clanId} isOfficer={isOfficer} members={members} workspace={workspace} />
        },
        {
          value: 'events',
          label: t('events'),
          count: workspace.upcoming.length,
          content: <WorkspaceEvents clanId={clanId} isOfficer={isOfficer} members={members} />
        },
        {
          value: 'roster',
          label: t('roster'),
          count: members.length,
          content: <WorkspaceRoster clanId={clanId} members={members} />
        },
        ...(isOfficer
          ? [{ value: 'candidates' as const, label: t('candidates'), count: recruits, content: <WorkspaceCandidates clanId={clanId} /> }]
          : [])
      ]}
      aria-label={t('label')}
      value={tab}
      variant='panel'
      onValueChange={onTabChange}
    />
  );
};
