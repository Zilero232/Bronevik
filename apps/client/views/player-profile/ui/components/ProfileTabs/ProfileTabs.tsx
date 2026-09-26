'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Tabs } from '@/ui-kit';

import type { ProfileTab } from '../../../config';

import { PROFILE_TABS } from '../../../config';
import { ProfileTabContent } from '../ProfileTabContent';

export const ProfileTabs = () => {
  const t = useTranslations('profile.tabs');

  const [tab, setTab] = useState<ProfileTab>('overview');

  return (
    <Tabs<ProfileTab>
      items={PROFILE_TABS.map((value) => ({ value, label: t(value), content: tab === value ? <ProfileTabContent tab={value} /> : null }))}
      value={tab}
      variant='panel'
      onValueChange={setTab}
    />
  );
};
