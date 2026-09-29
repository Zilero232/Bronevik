import { useTranslations } from 'use-intl';

import { PageHeader } from '@/ui-kit';
import { ComponentCatalog } from '@/widgets/component-catalog';
import { ConflictReport } from '@/widgets/conflict-report';

export const ComponentsView = () => {
  const t = useTranslations('components');

  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <ConflictReport />
      <ComponentCatalog />
    </>
  );
};
