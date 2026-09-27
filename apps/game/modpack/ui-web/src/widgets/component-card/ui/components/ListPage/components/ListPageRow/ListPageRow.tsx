import type { ListPageRowProps } from './ListPageRow.types';

import { useT } from '../../../../../../../entities/window-state';
import { Badge } from '../../../../../../../shared/ui/badge';
import { DetailList } from '../../../../../../../shared/ui/detail-list';
import { ListItem, ListItemActions, ListItemButton, ListItemInput, ListItemMain, ListItemNote } from '../../../../../../../shared/ui/list';

export const ListPageRow = ({ item }: ListPageRowProps) => {
  const t = useT();
  const { row } = item;

  return (
    <ListItem>
      <ListItemMain badge={row.badge && <Badge>{row.badge}</Badge>} title={row.title}>
        {row.subtitle && <ListItemNote>{row.subtitle}</ListItemNote>}
        {row.meta && <ListItemNote>{row.meta}</ListItemNote>}
        {item.detailsOpen && row.details && <DetailList items={row.details} />}
      </ListItemMain>
      {item.draftValue === null ? (
        <ListItemActions>
          {item.hasDetails && (
            <ListItemButton aria-expanded={item.detailsOpen} size='small' variant='ghost' onClick={item.toggleDetails}>
              {item.detailsOpen ? t('hideDetails') : t('details')}
            </ListItemButton>
          )}
          {item.actions.map((action) => (
            <ListItemButton key={action.id} size='small' onClick={action.onClick}>
              {action.label}
            </ListItemButton>
          ))}
        </ListItemActions>
      ) : (
        <ListItemActions>
          <ListItemInput aria-label={row.title} value={item.draftValue} onInput={(event) => item.editDraft(event.currentTarget.value)} />
          <ListItemButton variant='accent' onClick={item.submit}>
            {t('save')}
          </ListItemButton>
          <ListItemButton variant='ghost' onClick={item.cancel}>
            {t('cancel')}
          </ListItemButton>
        </ListItemActions>
      )}
    </ListItem>
  );
};
