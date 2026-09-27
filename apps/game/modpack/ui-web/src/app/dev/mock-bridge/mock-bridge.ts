import type { GamefaceMock } from '../../../shared/api/gameface/mock';
import type { UiState } from '../../../shared/api/protocol';

import { createGamefaceMock } from '../../../shared/api/gameface/mock';
import { messageSchema, parseState } from '../../../shared/api/protocol';
import sample from '../../../shared/api/protocol/_tests/fixtures/state.sample.json';
import { DEV_MOCK } from '../config';
import { applyMessage } from './apply-message';

const sampleState = (): UiState => {
  const state = parseState(JSON.stringify(sample));

  if (!state) {
    throw new Error(DEV_MOCK.invalidFixture);
  }

  return state;
};

export const createDevGameface = (): GamefaceMock => {
  let state = sampleState();

  return createGamefaceMock({
    state: JSON.stringify(state),
    clientSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
    onSend: (raw) => {
      const parsed = messageSchema.safeParse(JSON.parse(raw));

      console.warn(DEV_MOCK.logPrefix, raw);

      if (!parsed.success) {
        return null;
      }

      state = applyMessage({ state, message: parsed.data });

      return JSON.stringify(state);
    }
  });
};
