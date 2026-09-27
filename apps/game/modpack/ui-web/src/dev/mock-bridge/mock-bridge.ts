import type { UiState } from '../../settings/model/protocol';

import { messageSchema, parseState } from '../../settings/model/protocol';
import sample from '../../settings/model/protocol/_tests/fixtures/state.sample.json';
import { GAMEFACE } from '../../shared/gameface';
import { applyMessage } from './apply-message';

const sampleState = (): UiState => {
  const state = parseState(JSON.stringify(sample));

  if (!state) {
    throw new Error('[OTMETKI mock] the state fixture does not match the protocol');
  }

  return state;
};

export const installMockBridge = (): void => {
  const listeners: (() => void)[] = [];
  let state = sampleState();

  const model = {
    [GAMEFACE.stateProperty]: JSON.stringify(state),
    [GAMEFACE.sendCommand]: ({ message }: { message: string }) => {
      const parsed = messageSchema.safeParse(JSON.parse(message));

      console.warn('[OTMETKI mock] send', message);

      if (parsed.success) {
        state = applyMessage({ state, message: parsed.data });
        model[GAMEFACE.stateProperty] = JSON.stringify(state);
        listeners.forEach((listener) => listener());
      }
    }
  };

  Reflect.set(globalThis, GAMEFACE.modelGlobal, model);

  Reflect.set(globalThis, GAMEFACE.engineGlobal, {
    whenReady: Promise.resolve(),
    on: (event: string, listener: () => void) => {
      if (event === GAMEFACE.dataChangedEvent) {
        listeners.push(listener);
      }
    }
  });

  Reflect.set(globalThis, GAMEFACE.viewEnvGlobal, { [GAMEFACE.clientSizeMethod]: () => ({ width: window.innerWidth, height: window.innerHeight }) });
};
