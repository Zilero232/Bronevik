import { useEffect } from 'preact/hooks';

import { gameface } from '../../../../shared/gameface/gameface';
import { send } from '../../protocol/protocol';
import { receiveState } from '../../store/store';

export const useBridge = (): void => {
  useEffect(() => {
    gameface.onDataChanged(() => {
      receiveState(gameface.state());
    });

    send({ type: 'ready' });
  }, []);
};
