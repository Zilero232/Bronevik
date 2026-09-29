import { useTranslations } from 'use-intl';

import { UninstallModpackCard } from '@/features/setup/uninstall-modpack';
import { CreateSnapshotButton } from '@/features/snapshot/snapshot-actions';
import { HelpTip, PageHeader } from '@/ui-kit';
import { SnapshotList } from '@/widgets/snapshot-list';

import { useBackupsView } from '../model/hooks';

export const BackupsView = () => {
  const t = useTranslations();
  const { clientPath, isInstalled, hasSnapshots } = useBackupsView();

  return (
    <>
      <PageHeader
        actions={<CreateSnapshotButton clientPath={clientPath} />}
        description={t('backups.description')}
        help={<HelpTip label={t('help.tipLabel')}>{t('help.tips.backups')}</HelpTip>}
        title={t('backups.title')}
      />
      <SnapshotList />
      {isInstalled && <UninstallModpackCard clientPath={clientPath} hasSnapshots={hasSnapshots} />}
    </>
  );
};
