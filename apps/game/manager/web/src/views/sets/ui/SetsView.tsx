import { useTranslations } from 'use-intl';

import { ImportSetForm } from '@/features/component-set/import-set';
import { SaveSetForm } from '@/features/component-set/save-set';
import { Card, PageHeader } from '@/ui-kit';
import { SetList } from '@/widgets/set-list';

import { useSetsView } from '../model/hooks';

export const SetsView = () => {
  const t = useTranslations('sets');
  const { enabled, canSave } = useSetsView();

  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <SetList />
      <Card description={t('saveDescription')} title={t('saveTitle')}>
        <SaveSetForm components={enabled} disabled={!canSave} />
      </Card>
      <Card description={t('importDescription')} title={t('importTitle')}>
        <ImportSetForm />
      </Card>
    </>
  );
};
