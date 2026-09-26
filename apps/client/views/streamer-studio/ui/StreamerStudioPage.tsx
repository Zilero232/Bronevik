'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import type { TabItem } from '@/ui-kit';

import { Tabs } from '@/ui-kit';

import type { StudioTab } from '../config';

import { STUDIO_TABS } from '../config';
import { useStreamerStudio } from '../model/hooks';
import { ChallengesPanel, IntegrationsPanel, OverlaysPanel, ProfilePanel, StudioHeader } from './components';

import s from './StreamerStudioPage.module.scss';

export const StreamerStudioPage = () => {
  const t = useTranslations('streamer.studio.tabs');
  const { tab, onTabChange } = useStreamerStudio();

  const panels: Record<StudioTab, ReactNode> = {
    profile: <ProfilePanel />,
    integrations: <IntegrationsPanel />,
    overlays: <OverlaysPanel />,
    challenges: <ChallengesPanel />
  };

  const items: TabItem<StudioTab>[] = STUDIO_TABS.map((value) => ({ value, label: t(value), content: panels[value] }));

  return (
    <div className={s.root}>
      <StudioHeader />
      <Tabs<StudioTab> items={items} panelClassName={s.panel} value={tab} onValueChange={onTabChange} />
    </div>
  );
};
