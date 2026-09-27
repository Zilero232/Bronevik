import { overlayDataSchema } from '@otmetki/schemas';
import { match } from 'ts-pattern';

import type { OverlayData } from '@/entities/streamer/streamer';

import type { FeedEvent, FeedState } from './feed-state.types';

export const parseFeedMessage = (payload: string): OverlayData | null => {
  try {
    const parsed = overlayDataSchema.safeParse(JSON.parse(payload));

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export const INITIAL_FEED_STATE = { transport: 'stream', data: null } as const satisfies FeedState;

export const feedReducer = (state: FeedState, event: FeedEvent): FeedState =>
  match(event)
    .with({ type: 'message' }, ({ payload }) => {
      const data = state.transport === 'stream' ? parseFeedMessage(payload) : null;

      return data ? { ...state, data } : state;
    })
    .with({ type: 'error' }, () => (state.transport === 'polling' ? state : { ...state, transport: 'polling' as const }))
    .exhaustive();
