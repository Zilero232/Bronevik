import { useStore } from '@nanostores/preact';
import { useEffect } from 'preact/hooks';

import type { StringKey } from '../../../../../shared/i18n';

import { $invalid, $query, $state, $view, receiveState, WINDOW_VIEW } from '../../../../../entities/window-state';
import { gameface } from '../../../../../shared/api/gameface';
import { send } from '../../../../../shared/api/protocol';
import { bindWheelScroll } from '../../../../../shared/lib/wheel-scroll';
import { useWindowFrame } from '../../../../../widgets/window-frame';

export const useApp = () => {
  const state = useStore($state);
  const view = useStore($view);
  const query = useStore($query);
  const invalid = useStore($invalid);
  const frame = useWindowFrame(state?.window ?? null);

  useEffect(() => bindWheelScroll(document), []);

  useEffect(() => {
    gameface.fitView();
    gameface.onDataChanged(() => receiveState(gameface.state()));
    send({ type: 'ready' });
  }, []);

  const placeholderKey: StringKey = invalid ? 'invalidState' : 'loading';

  return {
    state,
    section: view.section,
    searching: query.trim().length >= WINDOW_VIEW.searchMinLength,
    frame,
    compact: frame.layout.compactNav,
    columns: frame.layout.columns,
    placeholderKey
  };
};
