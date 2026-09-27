import { useTranslations } from 'use-intl';

import { useNavigation } from '@/shared/lib';
import { PageHeader } from '@/ui-kit';
import { InstallWizard } from '@/widgets/install-wizard';

export const InstallView = () => {
  const t = useTranslations('install');
  const { params } = useNavigation();

  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <InstallWizard initialPreset={params.preset ?? null} />
    </>
  );
};
