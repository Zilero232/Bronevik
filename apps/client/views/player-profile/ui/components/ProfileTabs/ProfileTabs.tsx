'use client';

import { Tabs } from '@base-ui/react/tabs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { ProfileTab } from '../../../config';

import { PROFILE_TABS } from '../../../config';
import { ProfileTabContent } from '../ProfileTabContent';

import s from './ProfileTabs.module.scss';

export const ProfileTabs = () => {
  const t = useTranslations('profile.tabs');

  const [tab, setTab] = useState<ProfileTab>('overview');

  return (
    <Tabs.Root className={s.root} value={tab} onValueChange={(next: ProfileTab) => setTab(next)}>
      <div className={s.bar}>
        <Tabs.List className={s.list}>
          {PROFILE_TABS.map((value) => (
            <Tabs.Tab key={value} className={s.tab} value={value}>
              {t(value)}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className={s.indicator} />
        </Tabs.List>
      </div>
      {PROFILE_TABS.map((value) => (
        <Tabs.Panel key={value} className={s.panel} value={value}>
          {tab === value && <ProfileTabContent tab={value} />}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
};
