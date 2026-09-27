import { useTranslations } from 'use-intl';

import { UninstallModpackCard } from '@/features/setup/uninstall-modpack';
import { CreateSnapshotButton } from '@/features/snapshot/snapshot-actions';
import { PageHeader } from '@/ui-kit';
import { SnapshotList } from '@/widgets/snapshot-list';

import { useBackupsView } from '../model/hooks';

export const BackupsView = () => {
  const t = useTranslations('backups');
  const { clientPath, isInstalled, hasSnapshots } = useBackupsView();

  return (
    <>
      <PageHeader actions={<CreateSnapshotButton clientPath={clientPath} />} description={t('description')} title={t('title')} />
      <SnapshotList />
      {isInstalled && <UninstallModpackCard clientPath={clientPath} hasSnapshots={hasSnapshots} />}
    </>
  );
};
