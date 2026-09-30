import { useState } from 'preact/hooks';

import type { UseTextFieldInput } from './use-text-field.types';

import { KEYS } from '../../../../../shared/config';

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
    onKey: (key: string) => {
      if (key === KEYS.enter) {
        commit();
      }
    }
  };
};
