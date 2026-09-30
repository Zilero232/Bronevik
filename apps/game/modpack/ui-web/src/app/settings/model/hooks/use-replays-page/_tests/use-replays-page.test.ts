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

const WITH_REPLAYS_PAGE = JSON.stringify({
  ...sample,
  revision: 900,
  components: sample.components.map((component) => (component.id === 'replay_manager' ? { ...component, page: { kind: 'replays' } } : component))
});

const feed = (values: Record<string, unknown>): string =>
  JSON.stringify({ v: 2, feed: 'replay_manager', rev: 1, base: null, page: { kind: 'replays', status: 'ready' }, items: [{ id: 'a' }], ...values });

const SNAPSHOT = feed({});
const PAGE_GONE = feed({ rev: 2, base: 1, page: null, items: undefined, set: [], del: ['a'] });

let sent: () => unknown[];

const showPage = async () => {
  const hook = renderHook(useReplaysPage);

  await hook.settle();

  return hook;
};

const pushFeed = async ({ hook, messages }: { hook: Awaited<ReturnType<typeof showPage>>; messages: string[] }) => {
  messages.forEach((message) => receiveFeed(message));
  await hook.settle();
};

beforeEach(() => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);
  sent = () => mock.sent().map((raw) => JSON.parse(raw));
  $state.set(null);
  $feed.set(null);
  receiveState(WITH_REPLAYS_PAGE);
});

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(useReplaysPage, () => {
  it('watches the replays feed while the page is shown', async () => {
    await showPage();

    expect(sent()).toEqual([{ type: 'feed', component: 'replay_manager', active: true }]);
  });

  it('has no page until the feed arrives', async () => {
    const hook = await showPage();

    const view = hook.current();

    expect(view?.page).toBeUndefined();
  });

  it('hands over the feed page with its items', async () => {
    const hook = await showPage();

    await pushFeed({ hook, messages: [SNAPSHOT] });

    expect(hook.current()?.page).toEqual({ kind: 'replays', status: 'ready', items: [{ id: 'a' }] });
  });

  it('drops the page when a delta takes it away', async () => {
    const hook = await showPage();

    await pushFeed({ hook, messages: [SNAPSHOT, PAGE_GONE] });

    expect(hook.current()?.page).toBeNull();
  });

  it('stops watching the feed once the page is gone', async () => {
    const hook = await showPage();

    hook.unmount();

    expect(sent().at(-1)).toEqual({ type: 'feed', component: 'replay_manager', active: false });
  });

  it('forgets the feed once the page is gone', async () => {
    const hook = await showPage();

    await pushFeed({ hook, messages: [SNAPSHOT] });

    hook.unmount();

    expect($feed.get()).toBeNull();
  });
});
