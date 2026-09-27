import { useState } from 'preact/hooks';

import type { UiProfiles } from '../../../../../shared/api/protocol';
import type { RenameDraft } from './use-profiles.types';

import { send } from '../../../../../shared/api/protocol';
import { KEYS } from '../../../../../shared/config';

export const useProfiles = (profiles: UiProfiles) => {
  const [name, setName] = useState('');
  const [importCode, setImportCode] = useState('');
  const [renaming, setRenaming] = useState<RenameDraft | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const saveNew = (): void => {
    const trimmed = name.trim();

    if (trimmed) {
      send({ type: 'profile_save', name: trimmed });
      setName('');
    }
  };

  const importProfile = (): void => {
    const trimmed = importCode.trim();

    if (trimmed) {
      send({ type: 'profile_import', code: trimmed });
      setImportCode('');
    }
  };

  const commitRename = (): void => {
    const trimmed = renaming?.name.trim();

    if (renaming && trimmed) {
      send({ type: 'profile_rename', id: renaming.id, name: trimmed });
    }

    setRenaming(null);
  };

  const onEnter = (action: () => void) => (key: string) => {
    if (key === KEYS.enter) {
      action();
    }
  };

  return {
    name,
    setName,
    saveNew,
    onNameKey: onEnter(saveNew),
    importCode,
    setImportCode,
    importProfile,
    onImportKey: onEnter(importProfile),
    deleting: deleting !== null,
    confirmDelete: () => {
      if (deleting) {
        send({ type: 'profile_delete', id: deleting });
      }

      setDeleting(null);
    },
    cancelDelete: () => setDeleting(null),
    rows: profiles.items.map((profile) => ({
      profile,
      active: profiles.active === profile.id,
      renameValue: renaming?.id === profile.id ? renaming.name : null,
      load: () => send({ type: 'profile_load', id: profile.id }),
      overwrite: () => send({ type: 'profile_save', name: profile.name, id: profile.id }),
      exportCode: () => send({ type: 'profile_export', id: profile.id }),
      askDelete: () => setDeleting(profile.id),
      startRename: () => setRenaming({ id: profile.id, name: profile.name }),
      editRename: (next: string) => setRenaming((current) => (current ? { ...current, name: next } : current)),
      onRenameKey: onEnter(commitRename),
      commitRename,
      cancelRename: () => setRenaming(null)
    }))
  };
};
