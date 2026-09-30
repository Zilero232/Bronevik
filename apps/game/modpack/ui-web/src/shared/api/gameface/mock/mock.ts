import type { GamefaceMock, GamefaceMockInput } from './mock.types';

import { GAMEFACE } from '../gameface.constants';
import { GAMEFACE_MOCK } from './mock.constants';

export const createGamefaceMock = ({ state, feed = '', clientSize, mouse, onSend }: GamefaceMockInput): GamefaceMock => {
  const listeners: ((data: unknown, indexes: unknown, callbackIds: number[]) => void)[] = [];
  const sent: string[] = [];
  const inputAreas: number[][] = [];

  const model: Record<string, unknown> = {
    [GAMEFACE.model.state]: state,
    [GAMEFACE.model.feed]: feed,
    [GAMEFACE.model.send]: ({ message }: { message: string }) => {
      sent.push(message);

      const next = onSend(message);

      if (next === null) {
        return;
      }

      const push = typeof next === 'string' ? { state: next } : next;

      if (push.state !== undefined) {
        model[GAMEFACE.model.state] = push.state;
      }

      if (push.feed !== undefined) {
        model[GAMEFACE.model.feed] = push.feed;
      }

      listeners.forEach((listener) => listener(model, [], [GAMEFACE_MOCK.callbackId]));
    }
  };

  const engine = {
    [GAMEFACE.engine.whenReady]: Promise.resolve(),
    [GAMEFACE.engine.on]: (event: string, listener: (data: unknown, indexes: unknown, callbackIds: number[]) => void) => {
      if (event === GAMEFACE.engine.dataChangedEvent) {
        listeners.push(listener);
      }
    }
  };

  return {
    scope: {
      [GAMEFACE.globals.model]: model,
      [GAMEFACE.globals.engine]: engine,
      [GAMEFACE.globals.viewEnv]: {
        [GAMEFACE.viewEnv.clientSize]: clientSize,
        [GAMEFACE.dataChanged.register]: () => GAMEFACE_MOCK.callbackId,
        [GAMEFACE.viewEnv.inputArea]: (...area: number[]) => inputAreas.push(area),
        [GAMEFACE.viewEnv.mousePosition]: mouse
      }
    },
    sent: () => [...sent],
    inputAreas: () => [...inputAreas]
  };
};

export const installGamefaceMock = (mock: GamefaceMock): void => {
  Object.entries(mock.scope).forEach(([name, value]) => Reflect.set(globalThis, name, value));
};
