import { useTranslations } from 'use-intl';

import { PageHeader } from '@/ui-kit';
import { ComponentCatalog } from '@/widgets/component-catalog';

export const ComponentsView = () => {
  const t = useTranslations('components');

  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <ComponentCatalog />
    </>
  );
};
