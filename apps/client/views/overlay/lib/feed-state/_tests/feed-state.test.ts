import { overlayConfigSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import type { OverlayData } from '@/shared/api/streamers';

import { feedReducer, initialFeedState, parseFeedMessage } from '../feed-state';

const DATA: OverlayData = {
  kind: 'session',
  name: 'Session',
  config: overlayConfigSchema.parse({ metrics: ['battles', 'wn8'] }),
  player: null,
  session: null,
  overall: null,
  moe: null,
  challenge: null,
  updatedAt: '2026-09-25T10:00:00.000Z'
};

const MESSAGE = JSON.stringify(DATA);

describe('parseFeedMessage', () => {
  it('reads a message that matches the overlay contract', () => {
    expect(parseFeedMessage(MESSAGE)).toEqual(DATA);
  });

  it('drops a message that is not JSON', () => {
    expect(parseFeedMessage('ping')).toBeNull();
  });

  it('drops JSON that breaks the contract', () => {
    expect(parseFeedMessage(JSON.stringify({ ...DATA, kind: 'unknown' }))).toBeNull();
  });
});

describe('initialFeedState', () => {
  it('starts on the event stream against a real server', () => {
    expect(initialFeedState(false)).toEqual({ transport: 'stream', data: null });
  });

  it('starts on polling in mock mode, where no stream exists', () => {
    expect(initialFeedState(true).transport).toBe('polling');
  });
});

describe('feedReducer', () => {
  it('stores the latest valid stream message', () => {
    const next = feedReducer(initialFeedState(false), { type: 'message', payload: MESSAGE });

    expect(next.data).toEqual(DATA);
  });

  it('keeps the previous data when a malformed message arrives', () => {
    const live = feedReducer(initialFeedState(false), { type: 'message', payload: MESSAGE });

    expect(feedReducer(live, { type: 'message', payload: '{' })).toBe(live);
  });

  it('falls back to polling on a stream error and keeps what was already shown', () => {
    const live = feedReducer(initialFeedState(false), { type: 'message', payload: MESSAGE });
    const fallen = feedReducer(live, { type: 'error' });

    expect(fallen.transport).toBe('polling');
    expect(fallen.data).toBe(live.data);
  });

  it('ignores late stream messages once it has fallen back to polling', () => {
    const polling = feedReducer(initialFeedState(false), { type: 'error' });

    expect(feedReducer(polling, { type: 'message', payload: MESSAGE })).toBe(polling);
  });

  it('treats a repeated error as a no-op', () => {
    const polling = initialFeedState(true);

    expect(feedReducer(polling, { type: 'error' })).toBe(polling);
  });
});
