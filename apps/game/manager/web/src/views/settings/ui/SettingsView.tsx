import { useTranslations } from 'use-intl';

import { useSettings } from '@/entities/settings';
import { ClientPicker } from '@/features/client/client-picker';
import { SettingsForm } from '@/features/settings/settings-form';
import { Card, PageHeader, QueryState } from '@/ui-kit';

export const SettingsView = () => {
  const t = useTranslations();
  const settingsQuery = useSettings();

  return (
    <>
      <PageHeader title={t('settings.title')} />
      <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={settingsQuery} retryLabel={t('common.retry')}>
        {(settings) => <SettingsForm settings={settings} />}
      </QueryState>
      <Card title={t('settings.clientTitle')}>
        <ClientPicker />
      </Card>
    </>
  );
};
