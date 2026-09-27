import { useState } from 'preact/hooks';

import type { RunActionInput } from '../use-actions/use-actions.types';
import type { RowChoice, RowDraft } from './use-row-editor.types';

export const useRowEditor = (onRun: (input: RunActionInput) => void) => {
  const [draft, setDraft] = useState<RowDraft | null>(null);

  return {
    draft,
    edit: (value: string) => draft && setDraft({ ...draft, value }),
    stop: () => setDraft(null),
    choose: ({ row, action }: RowChoice) => {
      if (action.input === undefined || action.input === null) {
        onRun({ action, row });

        return;
      }

      setDraft({ row, action, value: action.input });
    },
    submit: () => {
      if (draft) {
        onRun({ action: draft.action, row: draft.row, value: draft.value });
      }

      setDraft(null);
    }
  };
};
