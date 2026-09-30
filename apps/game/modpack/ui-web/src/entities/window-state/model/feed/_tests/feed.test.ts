import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { GAMEFACE } from '../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../shared/api/gameface/mock';
import { $feed, receiveFeed, unwatchFeed, watchFeed } from '../feed';

const COMPONENT = 'replay_manager';

const message = (values: Record<string, unknown>): string =>
  JSON.stringify({ v: 2, feed: COMPONENT, rev: 1, base: null, page: { kind: 'replays' }, items: [{ id: 'a' }], ...values });

let sent: () => unknown[];

beforeEach(() => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);
  sent = () => mock.sent().map((raw) => JSON.parse(raw));
});

afterEach(() => {
  unwatchFeed(COMPONENT);
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe('feed', () => {
  it('asks for the feed of the page it shows and takes its snapshot and deltas', () => {
    watchFeed(COMPONENT);

    expect(sent()).toEqual([{ type: 'feed', component: COMPONENT, active: true }]);
    expect(receiveFeed(message({}))).toBe(true);
    expect(receiveFeed(message({ rev: 2, base: 1, items: undefined, set: [{ id: 'b' }], del: ['a'] }))).toBe(true);
    expect($feed.get()?.items).toEqual([{ id: 'b' }]);
  });

  it('asks once for a new snapshot when it lost track, then takes it', () => {
    watchFeed(COMPONENT);
    receiveFeed(message({}));

    expect(receiveFeed(message({ rev: 5, base: 4, set: [] }))).toBe(false);
    expect(receiveFeed(message({ rev: 6, base: 5, set: [] }))).toBe(false);
    expect(sent()).toHaveLength(2);
    expect(receiveFeed(message({ rev: 7, items: [{ id: 'c' }] }))).toBe(true);
    expect($feed.get()?.items).toEqual([{ id: 'c' }]);
    expect(receiveFeed(message({ rev: 9, base: 8, set: [] }))).toBe(false);
    expect(sent()).toHaveLength(3);
  });

  it('ignores a feed it does not watch and drops the data when the page goes', () => {
    expect(receiveFeed(message({}))).toBe(false);
    watchFeed(COMPONENT);
    expect(receiveFeed(message({ feed: 'other' }))).toBe(false);
    expect(receiveFeed('{')).toBe(false);
    receiveFeed(message({}));
    unwatchFeed(COMPONENT);

    expect($feed.get()).toBeNull();
    expect(sent().at(-1)).toEqual({ type: 'feed', component: COMPONENT, active: false });
    expect(receiveFeed(message({ rev: 3 }))).toBe(false);
  });
});
