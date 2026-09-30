import { useTranslations } from 'use-intl';

import { ImportSetForm } from '@/features/component-set/import-set';
import { SaveSetForm } from '@/features/component-set/save-set';
import { Card, HelpTip, PageHeader } from '@/ui-kit';
import { SectionTabs } from '@/widgets/section-tabs';
import { SetList } from '@/widgets/set-list';
import { SiteSyncCard } from '@/widgets/site-sync-card';

import { useSetsView } from '../model/hooks';

export const SetsView = () => {
  const t = useTranslations();
  const { enabled, canSave } = useSetsView();

  return (
    <>
      <SectionTabs section='sets' />
      <PageHeader
        description={t('sets.description')}
        help={<HelpTip label={t('help.tipLabel')}>{t('help.tips.sets')}</HelpTip>}
        title={t('sets.title')}
      />
      <SetList />
      <SiteSyncCard />
      <Card description={t('sets.saveDescription')} title={t('sets.saveTitle')}>
        <SaveSetForm components={enabled} disabled={!canSave} />
      </Card>
      <Card description={t('sets.importDescription')} title={t('sets.importTitle')}>
        <ImportSetForm />
      </Card>
    </>
  );
};
