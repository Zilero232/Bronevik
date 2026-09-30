import { useState } from 'preact/hooks';

import type { UiProfile } from '../../../../../shared/api/protocol';
import type { RenameDraft } from './use-profile-rename.types';

import { send } from '../../../../../shared/api/protocol';
import { onEnterKey } from '../../../../../shared/lib/enter-key';

export const useProfileRename = () => {
  const [renaming, setRenaming] = useState<RenameDraft | null>(null);

  const commitRename = (): void => {
    const trimmed = renaming?.name.trim();

    if (renaming && trimmed) {
      send({ type: 'profile_rename', id: renaming.id, name: trimmed });
    }

    setRenaming(null);
  };

  return {
    renameValue: (profile: UiProfile): string | null => (renaming?.id === profile.id ? renaming.name : null),
    startRename: (profile: UiProfile) => setRenaming({ id: profile.id, name: profile.name }),
    editRename: (next: string) => setRenaming((current) => (current ? { ...current, name: next } : current)),
    onRenameKey: onEnterKey(commitRename),
    commitRename,
    cancelRename: () => setRenaming(null)
  };
};
