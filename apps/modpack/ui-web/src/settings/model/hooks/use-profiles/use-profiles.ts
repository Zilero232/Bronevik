import { useState } from 'preact/hooks';

import type { UiState } from '../../protocol/protocol.types';
import type { RenameDraft } from './use-profiles.types';

import { send } from '../../protocol/protocol';

export const useProfiles = (profiles: UiState['profiles']) => {
  const [name, setName] = useState('');
  const [importCode, setImportCode] = useState('');
  const [renaming, setRenaming] = useState<RenameDraft | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  return {
    name,
    setName,
    importCode,
    setImportCode,
    renaming,
    deleting,
    saveNew: () => {
      if (name.trim()) {
        send({ type: 'profile_save', name: name.trim() });
        setName('');
      }
    },
    overwrite: (id: string) => {
      const profile = profiles.items.find((item) => item.id === id);

      if (profile) {
        send({ type: 'profile_save', name: profile.name, id });
      }
    },
    load: (id: string) => send({ type: 'profile_load', id }),
    exportCode: (id: string) => send({ type: 'profile_export', id }),
    startRename: (draft: RenameDraft) => setRenaming(draft),
    editRename: (next: string) => renaming && setRenaming({ ...renaming, name: next }),
    commitRename: () => {
      if (renaming?.name.trim()) {
        send({ type: 'profile_rename', id: renaming.id, name: renaming.name.trim() });
      }

      setRenaming(null);
    },
    cancelRename: () => setRenaming(null),
    askDelete: setDeleting,
    confirmDelete: () => {
      if (deleting) {
        send({ type: 'profile_delete', id: deleting });
      }

      setDeleting(null);
    },
    cancelDelete: () => setDeleting(null),
    importProfile: () => {
      if (importCode.trim()) {
        send({ type: 'profile_import', code: importCode.trim() });
        setImportCode('');
      }
    }
  };
};
