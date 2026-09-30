import type { GamefaceMock } from '../../../shared/api/gameface/mock';
import type { UiState } from '../../../shared/api/protocol';

import { REPLAYS } from '../../../entities/replays';
import replaysSample from '../../../entities/replays/_tests/fixtures/replays-page.sample.json';
import { createGamefaceMock } from '../../../shared/api/gameface/mock';
import { messageSchema, parseState, PROTOCOL } from '../../../shared/api/protocol';
import sample from '../../../shared/api/protocol/_tests/fixtures/state.sample.json';
import { DEV_MOCK } from '../config';
import { applyMessage } from './apply-message';

const sampleState = (): UiState => {
  const state = parseState(JSON.stringify(sample));

  if (!state) {
    throw new Error(DEV_MOCK.invalidFixture);
  }

  return {
    ...state,
    components: state.components.map((component) =>
      component.id === DEV_MOCK.replaysComponent ? { ...component, page: { kind: REPLAYS.pageKind } } : component
    )
  };
};

const replaysSnapshot = (rev: number): string => {
  const { items, ...page } = replaysSample;

  return JSON.stringify({ v: PROTOCOL.version, feed: DEV_MOCK.replaysComponent, rev, base: null, page, items });
};

export const createDevGameface = (): GamefaceMock => {
  let state = sampleState();
  let feedRev = 0;

  return createGamefaceMock({
    state: JSON.stringify(state),
    clientSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
    onSend: (raw) => {
      const parsed = messageSchema.safeParse(JSON.parse(raw));

      console.warn(DEV_MOCK.logPrefix, raw);

      if (!parsed.success) {
        return null;
      }

      if (parsed.data.type === 'feed') {
        feedRev += 1;

        return parsed.data.active ? { feed: replaysSnapshot(feedRev) } : null;
      }

      state = applyMessage({ state, message: parsed.data });

      return JSON.stringify(state);
    }
  });
};
