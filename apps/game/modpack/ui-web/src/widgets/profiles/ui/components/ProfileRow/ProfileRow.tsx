import type { ProfileRowProps } from './ProfileRow.types';

import { useT } from '../../../../../entities/window-state';
import { Badge } from '../../../../../shared/ui/badge';
import { ListItem, ListItemActions, ListItemButton, ListItemInput, ListItemMain } from '../../../../../shared/ui/list';
import { PROFILES } from '../../../config';

export const ProfileRow = ({ row }: ProfileRowProps) => {
  const t = useT();

  return (
    <ListItem active={row.active}>
      {row.renameValue === null ? (
        <>
          <ListItemMain badge={row.active && <Badge tone='gold'>{t('profileActive')}</Badge>} title={row.profile.name} />
          <ListItemActions>
            <ListItemButton size='small' variant='accent' onClick={row.load}>
              {t('profileLoad')}
            </ListItemButton>
            <ListItemButton size='small' onClick={row.overwrite}>
              {t('profileOverwrite')}
            </ListItemButton>
            <ListItemButton size='small' onClick={row.startRename}>
              {t('profileRename')}
            </ListItemButton>
            <ListItemButton size='small' onClick={row.exportCode}>
              {t('profileExport')}
            </ListItemButton>
            <ListItemButton size='small' variant='danger' onClick={row.askDelete}>
              {t('profileDelete')}
            </ListItemButton>
          </ListItemActions>
        </>
      ) : (
        <ListItemActions>
          <ListItemInput
            aria-label={t('profileName')}
            maxLength={PROFILES.nameMaxLength}
            value={row.renameValue}
            onInput={(event) => row.editRename(event.currentTarget.value)}
            onKeyDown={(event) => row.onRenameKey(event.key)}
          />
          <ListItemButton variant='accent' onClick={row.commitRename}>
            {t('save')}
          </ListItemButton>
          <ListItemButton variant='ghost' onClick={row.cancelRename}>
            {t('cancel')}
          </ListItemButton>
        </ListItemActions>
      )}
    </ListItem>
  );
};
