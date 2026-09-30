// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { $feed, $state, receiveFeed, receiveState } from '../../../../../../entities/window-state';
import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { parseState } from '../../../../../../shared/api/protocol';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useReplaysPage } from '../use-replays-page';

const sample = parseState(
  readFileSync(path.resolve(import.meta.dirname, '../../../../../../shared/api/protocol/_tests/fixtures/state.sample.json'), 'utf8')
);

if (!sample) {
  throw new Error('the state fixture does not parse');
}

const withReplaysPage = JSON.stringify({
  ...sample,
  revision: 900,
  components: sample.components.map((component) => (component.id === 'replay_manager' ? { ...component, page: { kind: 'replays' } } : component))
});

const feed = (values: Record<string, unknown>): string =>
  JSON.stringify({ v: 2, feed: 'replay_manager', rev: 1, base: null, page: { kind: 'replays', status: 'ready' }, items: [{ id: 'a' }], ...values });

let sent: () => unknown[];

beforeEach(() => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);
  sent = () => mock.sent().map((raw) => JSON.parse(raw));
  $state.set(null);
  $feed.set(null);
  receiveState(withReplaysPage);
});

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(useReplaysPage, () => {
  it('watches the replays feed while the page is shown and hands over its page with the items', async () => {
    const hook = renderHook(useReplaysPage);

    await hook.settle();

    expect(sent()).toEqual([{ type: 'feed', component: 'replay_manager', active: true }]);
    expect(hook.current()?.page).toBeUndefined();

    expect(receiveFeed(feed({}))).toBe(true);
    await hook.settle();

    expect(hook.current()?.page).toEqual({ kind: 'replays', status: 'ready', items: [{ id: 'a' }] });

    expect(receiveFeed(feed({ rev: 2, base: 1, page: null, items: undefined, set: [], del: ['a'] }))).toBe(true);
    await hook.settle();

    expect(hook.current()?.page).toBeNull();

    hook.unmount();

    expect(sent().at(-1)).toEqual({ type: 'feed', component: 'replay_manager', active: false });
    expect($feed.get()).toBeNull();
  });
});
