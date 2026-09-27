import { useState } from 'preact/hooks';

import type { UseIntFieldInput } from './use-int-field.types';

import { KEYS } from '../../../../../shared/config';
import { clampInt } from '../../../../../shared/lib/clamp-int';
import { INT_FIELD } from '../../../config';

export const useIntField = ({ value, min, max, onCommit }: UseIntFieldInput) => {
  const [draft, setDraft] = useState<string | null>(null);

  const apply = (raw: string): void => {
    const next = clampInt({ raw, min, max });

    if (next !== null && next !== value) {
      onCommit(next);
    }
  };

  const commit = (): void => {
    apply(draft ?? String(value));
    setDraft(null);
  };

  return {
    text: draft ?? String(value),
    edit: setDraft,
    commit,
    onKey: (key: string) => {
      if (key === KEYS.enter) {
        commit();
      }
    },
    decrease: () => apply(String(value - INT_FIELD.step)),
    increase: () => apply(String(value + INT_FIELD.step))
  };
};
