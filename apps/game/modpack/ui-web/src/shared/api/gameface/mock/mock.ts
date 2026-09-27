import type { GamefaceMock, GamefaceMockInput } from './mock.types';

import { GAMEFACE } from '../gameface.constants';

export const createGamefaceMock = ({ state, clientSize, onSend }: GamefaceMockInput): GamefaceMock => {
  const listeners: (() => void)[] = [];
  const sent: string[] = [];

  const model: Record<string, unknown> = {
    [GAMEFACE.model.state]: state,
    [GAMEFACE.model.send]: ({ message }: { message: string }) => {
      sent.push(message);

      const next = onSend(message);

      if (next !== null) {
        model[GAMEFACE.model.state] = next;
        listeners.forEach((listener) => listener());
      }
    }
  };

  const engine = {
    [GAMEFACE.engine.whenReady]: Promise.resolve(),
    [GAMEFACE.engine.on]: (event: string, listener: () => void) => {
      if (event === GAMEFACE.engine.dataChangedEvent) {
        listeners.push(listener);
      }
    }
  };

  return {
    scope: {
      [GAMEFACE.globals.model]: model,
      [GAMEFACE.globals.engine]: engine,
      [GAMEFACE.globals.viewEnv]: { [GAMEFACE.viewEnv.clientSize]: clientSize }
    },
    sent: () => [...sent]
  };
};

export const installGamefaceMock = (mock: GamefaceMock): void => {
  Object.entries(mock.scope).forEach(([name, value]) => Reflect.set(globalThis, name, value));
};
