'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Tabs } from '@/ui-kit';

import type { ProfileTab } from '../../../config';

import { PROFILE_TAB_ICONS, PROFILE_TABS } from '../../../config';
import { ChartsTab } from '../ChartsTab';
import { HistoryTab } from '../HistoryTab';
import { InsightsTab } from '../InsightsTab';
import { MarksTab } from '../MarksTab';
import { OverviewTab } from '../OverviewTab';
import { SessionsTab } from '../SessionsTab';
import { TanksTab } from '../TanksTab';

const CONTENT: Record<ProfileTab, () => ReactNode> = {
  overview: () => <OverviewTab />,
  tanks: () => <TanksTab />,
  sessions: () => <SessionsTab />,
  marks: () => <MarksTab />,
  charts: () => <ChartsTab />,
  insights: () => <InsightsTab />,
  history: () => <HistoryTab />
};

export const ProfileTabs = () => {
  const t = useTranslations('profile.tabs');

  const [tab, setTab] = useState<ProfileTab>('overview');

  const items = PROFILE_TABS.map((value) => {
    const Icon = PROFILE_TAB_ICONS[value];

    return { value, label: t(value), icon: <Icon size={16} />, content: tab === value ? CONTENT[value]() : null };
  });

  return <Tabs<ProfileTab> items={items} value={tab} onValueChange={setTab} />;
};
