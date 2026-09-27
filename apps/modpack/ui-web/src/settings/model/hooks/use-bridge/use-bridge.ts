import { useEffect } from 'preact/hooks';

import { gameface } from '../../../../shared/gameface';
import { send } from '../../protocol';
import { receiveState } from '../../store';

export const useBridge = (): void => {
  useEffect(() => {
    gameface.onDataChanged(() => {
      receiveState(gameface.state());
    });

    send({ type: 'ready' });
  }, []);
};
