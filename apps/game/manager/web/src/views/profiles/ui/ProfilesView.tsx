import { useTranslations } from 'use-intl';

import { ImportProfileForm } from '@/features/profile/import-profile';
import { SaveProfileForm } from '@/features/profile/save-profile';
import { Card, PageHeader } from '@/ui-kit';
import { ProfileList } from '@/widgets/profile-list';

import { useProfilesView } from '../model/hooks';

export const ProfilesView = () => {
  const t = useTranslations('profiles');
  const { clientPath, initialCode, isDisabled } = useProfilesView();

  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <ProfileList />
      <Card title={t('saveTitle')}>
        <SaveProfileForm clientPath={clientPath} disabled={isDisabled} />
      </Card>
      <Card title={t('importTitle')}>
        <ImportProfileForm clientPath={clientPath} disabled={isDisabled} initialCode={initialCode} />
      </Card>
    </>
  );
};
