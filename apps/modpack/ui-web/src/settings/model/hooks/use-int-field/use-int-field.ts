import { useState } from 'preact/hooks';

import type { IntFieldInput } from './use-int-field.types';

import { clampInt } from '../../lib/clamp-int/clamp-int';

export const useIntField = ({ value, min, max, onCommit }: IntFieldInput) => {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (): void => {
    const next = clampInt({ raw: draft ?? String(value), min, max });

    setDraft(null);

    if (next !== null && next !== value) {
      onCommit(next);
    }
  };

  return {
    text: draft ?? String(value),
    edit: setDraft,
    commit,
    step: (delta: number) => {
      const next = clampInt({ raw: String(value + delta), min, max });

      if (next !== null && next !== value) {
        onCommit(next);
      }
    }
  };
};
