import type { RowDraftEditorProps } from './RowDraftEditor.types';

import { useT } from '../../../../../../../entities/window-state';
import { ListItemActions, ListItemButton, ListItemInput } from '../../../../../../../shared/ui/list';

export const RowDraftEditor = ({ item, draftValue }: RowDraftEditorProps) => {
  const t = useT();

  return (
    <ListItemActions>
      <ListItemInput aria-label={item.row.title} value={draftValue} onChange={(event) => item.editDraft(event.currentTarget.value)} />
      <ListItemButton variant='accent' onClick={item.submit}>
        {t('save')}
      </ListItemButton>
      <ListItemButton variant='ghost' onClick={item.cancel}>
        {t('cancel')}
      </ListItemButton>
    </ListItemActions>
  );
};
