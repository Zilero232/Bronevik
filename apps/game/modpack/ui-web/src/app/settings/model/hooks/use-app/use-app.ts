import { useStore } from '@nanostores/preact';
import { useEffect } from 'preact/hooks';

import type { StringKey } from '../../../../../shared/i18n';

import { $invalid, $selected, $state, $view, receiveState } from '../../../../../entities/window-state';
import { gameface } from '../../../../../shared/api/gameface';
import { send } from '../../../../../shared/api/protocol';

export const useApp = () => {
  const state = useStore($state);
  const view = useStore($view);
  const selected = useStore($selected);
  const invalid = useStore($invalid);

  useEffect(() => {
    gameface.fitView();
    gameface.onDataChanged(() => receiveState(gameface.state()));
    send({ type: 'ready' });
  }, []);

  const placeholderKey: StringKey = invalid ? 'invalidState' : 'loading';

  return { state, section: view.section, selected, placeholderKey };
};
