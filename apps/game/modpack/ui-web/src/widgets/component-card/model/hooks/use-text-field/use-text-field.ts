import { useState } from 'react';

import type { UseTextFieldInput } from './use-text-field.types';

import { onEnterKey } from '../../../../../shared/lib/enter-key';

export const useTextField = ({ value, onCommit }: UseTextFieldInput) => {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (): void => {
    if (draft !== null && draft !== value) {
      onCommit(draft);
    }

    setDraft(null);
  };

  return {
    text: draft ?? value,
    edit: setDraft,
    commit,
    onKey: onEnterKey(commit)
  };
};
