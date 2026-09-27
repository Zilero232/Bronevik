import { useState } from 'preact/hooks';

import type { PendingAction, RunActionInput } from './use-actions.types';

import { send } from '../../protocol/protocol';

export const useActions = (componentId: string) => {
  const [pending, setPending] = useState<PendingAction | null>(null);

  const perform = ({ action, row, value }: RunActionInput): void => {
    setPending(null);

    if (action.link) {
      send({ type: 'open', path: action.link });

      return;
    }

    send({ type: 'action', component: componentId, action: action.id, row, value });
  };

  const run = (input: RunActionInput): void => {
    if (input.action.confirm) {
      setPending(input);

      return;
    }

    perform(input);
  };

  return {
    pending,
    run,
    confirm: () => pending && perform(pending),
    cancel: () => setPending(null)
  };
};
