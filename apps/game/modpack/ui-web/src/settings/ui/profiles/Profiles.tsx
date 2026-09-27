import type { ProfilesProps } from './Profiles.types';

import { INPUT_LIMITS } from '../../config';
import { useProfiles } from '../../model/hooks/use-profiles';
import { useT } from '../../model/hooks/use-t';
import { Badge } from '../badge';
import { Button } from '../button';
import { Card } from '../card';
import { Confirm } from '../confirm';
import { Empty } from '../empty';
import { Input } from '../input';
import { Row, RowActions, RowButton, RowInput, RowList, RowMain } from '../row';

import s from './Profiles.module.scss';

export const Profiles = ({ profiles }: ProfilesProps) => {
  const t = useT();
  const model = useProfiles(profiles);

  return (
    <Card hint={t('profilesHint')} title={t('sectionProfiles')}>
      <div className={s.form}>
        <Input
          className={s.formInput}
          maxLength={INPUT_LIMITS.profileName}
          placeholder={t('profileName')}
          value={model.name}
          variant='wide'
          onInput={(event) => model.setName(event.currentTarget.value)}
        />
        <Button variant='accent' onClick={model.saveNew}>
          {t('profileSaveNew')}
        </Button>
      </div>
      {profiles.items.length === 0 && <Empty>{t('profilesEmpty')}</Empty>}
      <RowList>
        {profiles.items.map((profile) => (
          <Row key={profile.id} active={profiles.active === profile.id}>
            {model.renaming?.id === profile.id ? (
              <RowActions>
                <RowInput
                  maxLength={INPUT_LIMITS.profileName}
                  value={model.renaming.name}
                  onInput={(event) => model.editRename(event.currentTarget.value)}
                />
                <RowButton variant='accent' onClick={model.commitRename}>
                  {t('save')}
                </RowButton>
                <RowButton variant='ghost' onClick={model.cancelRename}>
                  {t('cancel')}
                </RowButton>
              </RowActions>
            ) : (
              <>
                <RowMain badge={profiles.active === profile.id && <Badge tone='gold'>{t('profileActive')}</Badge>} title={profile.name} />
                <RowActions>
                  <RowButton size='small' variant='accent' onClick={() => model.load(profile.id)}>
                    {t('profileLoad')}
                  </RowButton>
                  <RowButton size='small' onClick={() => model.overwrite(profile.id)}>
                    {t('profileOverwrite')}
                  </RowButton>
                  <RowButton size='small' onClick={() => model.startRename({ id: profile.id, name: profile.name })}>
                    {t('profileRename')}
                  </RowButton>
                  <RowButton size='small' onClick={() => model.exportCode(profile.id)}>
                    {t('profileExport')}
                  </RowButton>
                  <RowButton size='small' variant='danger' onClick={() => model.askDelete(profile.id)}>
                    {t('profileDelete')}
                  </RowButton>
                </RowActions>
              </>
            )}
          </Row>
        ))}
      </RowList>
      {model.deleting && <Confirm text={t('profileDeleteConfirm')} onCancel={model.cancelDelete} onConfirm={model.confirmDelete} />}
      <div className={s.form}>
        <Input
          className={s.formInput}
          placeholder={t('profileImportPlaceholder')}
          value={model.importCode}
          variant='wide'
          onInput={(event) => model.setImportCode(event.currentTarget.value)}
        />
        <Button onClick={model.importProfile}>{t('profileImport')}</Button>
      </div>
    </Card>
  );
};
