import { useTranslations } from 'use-intl';

import { PageHeader } from '@/ui-kit';
import { ClientOverview } from '@/widgets/client-overview';
import { PatchStatus } from '@/widgets/patch-status';

export const HomeView = () => {
  const t = useTranslations('home');

  return (
    <>
      <PageHeader title={t('title')} />
      <PatchStatus />
      <ClientOverview />
    </>
  );
};
