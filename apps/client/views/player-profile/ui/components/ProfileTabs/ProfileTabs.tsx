'use client';

import { useTranslations } from 'next-intl';

import { Tabs } from '@/ui-kit';

import { PROFILE_TABS } from '../../../config';
import { useProfileTab } from '../../../model/hooks';
import { ProfileTabContent } from '../ProfileTabContent';

export const ProfileTabs = () => {
  const t = useTranslations('profile.tabs');
  const { tab, setTab } = useProfileTab();

  return (
    <Tabs
      items={PROFILE_TABS.map((value) => ({ value, label: t(value), content: <ProfileTabContent tab={value} /> }))}
      value={tab}
      variant='sticky'
      onValueChange={setTab}
    />
  );
};
