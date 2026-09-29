import { useTranslations } from 'use-intl';

import { HelpTip, PageHeader } from '@/ui-kit';
import { ComponentCatalog } from '@/widgets/component-catalog';
import { ConflictReport } from '@/widgets/conflict-report';

export const ComponentsView = () => {
  const t = useTranslations();

  return (
    <>
      <PageHeader
        description={t('components.description')}
        help={<HelpTip label={t('help.tipLabel')}>{t('help.tips.components')}</HelpTip>}
        title={t('components.title')}
      />
      <ConflictReport />
      <ComponentCatalog />
    </>
  );
};
