import type { ProfilesProps } from './Profiles.types';

import { useT } from '../../../entities/window-state';
import { Card } from '../../../shared/ui/card';
import { Confirm } from '../../../shared/ui/confirm';
import { Empty } from '../../../shared/ui/empty';
import { List } from '../../../shared/ui/list';
import { PROFILES } from '../config';
import { useProfiles } from '../model/hooks';
import { InlineForm, ProfileRow } from './components';

export const Profiles = ({ profiles }: ProfilesProps) => {
  const t = useT();
  const model = useProfiles(profiles);

  return (
    <Card hint={t('profilesHint')} title={t('sectionProfiles')}>
      <InlineForm
        accent
        label={t('profileName')}
        maxLength={PROFILES.nameMaxLength}
        placeholder={t('profileName')}
        submitLabel={t('profileSaveNew')}
        value={model.name}
        onKey={model.onNameKey}
        onSubmit={model.saveNew}
        onValue={model.setName}
      />
      {model.rows.length === 0 ? (
        <Empty>{t('profilesEmpty')}</Empty>
      ) : (
        <List label={t('sectionProfiles')}>
          {model.rows.map((row) => (
            <ProfileRow key={row.profile.id} row={row} />
          ))}
        </List>
      )}
      {model.deleting && (
        <Confirm
          cancelLabel={t('cancel')}
          confirmLabel={t('confirm')}
          text={t('profileDeleteConfirm')}
          onCancel={model.cancelDelete}
          onConfirm={model.confirmDelete}
        />
      )}
      <InlineForm
        label={t('profileImport')}
        placeholder={t('profileImportPlaceholder')}
        submitLabel={t('profileImport')}
        value={model.importCode}
        onKey={model.onImportKey}
        onSubmit={model.importProfile}
        onValue={model.setImportCode}
      />
    </Card>
  );
};
