// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReplayItem } from '../../../../../../entities/replays';

import { pageSample } from '../../../../../../entities/replays/_tests/fixtures';
import { send } from '../../../../../../shared/api/protocol/protocol';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useReplaysBrowser } from '../use-replays-browser';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const PAGE = pageSample();
const NOW = 1_790_600_000;

const replayAt = (index: number): ReplayItem => {
  const item = PAGE.items[index];

  if (!item) {
    throw new Error(`the sample has no replay #${index}`);
  }

  return item;
};

const FAVOURITE = replayAt(0);
const OTHER_CLIENT = replayAt(1);

const mount = (page: unknown = PAGE, enabled = true) => renderHook(() => useReplaysBrowser({ page, enabled, now: NOW }));

const sent = (): unknown[] => vi.mocked(send).mock.calls.map(([message]) => message);

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useReplaysBrowser, () => {
  it('lists the whole page', () => {
    const hook = mount();

    expect(hook.current().view).toBe('list');
    expect(hook.current().visible.map((item) => item.id)).toEqual([FAVOURITE.id, OTHER_CLIENT.id]);
  });

  it('selects the first replay', () => {
    expect(mount().current().selected?.id).toBe(FAVOURITE.id);
  });

  it('is off while the component is disabled', () => {
    expect(mount(PAGE, false).current().view).toBe('off');
  });

  it('is indexing before the first page arrives', () => {
    const hook = renderHook(() => useReplaysBrowser({ page: undefined, enabled: true, now: NOW }));

    expect(hook.current().view).toBe('indexing');
  });

  it.each([
    ['a missing page', null],
    ['a page that fails the schema', { kind: 'list' }]
  ])('calls %s unreadable', (_name, page) => {
    expect(mount(page).current().view).toBe('invalid');
  });

  it.each([
    ['no_account', 'a page without a bound account', { ...PAGE, status: 'no_account' }],
    ['empty', 'a ready page with no replays', { ...PAGE, items: [] }],
    ['indexing', 'a page still being read', { ...PAGE, status: 'indexing', items: [] }]
  ])('shows %s for %s', (view, _name, page) => {
    expect(mount(page).current().view).toBe(view);
  });

  it('says nothing was found when the filters hide every replay', () => {
    const hook = mount();

    hook.run(() => hook.current().patch({ query: 'nothing like this' }));

    expect(hook.current().view).toBe('nothing');
  });

  it('lists the page again after a filter reset', () => {
    const hook = mount();

    hook.run(() => hook.current().patch({ query: 'nothing like this' }));

    hook.run(() => hook.current().reset());

    expect(hook.current().view).toBe('list');
  });

  it('sorts descending on the first pick of a sort', () => {
    const hook = mount();

    hook.run(() => hook.current().sortBy('damage'));

    expect(hook.current().filters).toMatchObject({ sort: 'damage', descending: true });
  });

  it('flips the order on a second pick of the same sort', () => {
    const hook = mount();

    hook.run(() => hook.current().sortBy('damage'));

    hook.run(() => hook.current().sortBy('damage'));

    expect(hook.current().filters).toMatchObject({ sort: 'damage', descending: false });
  });

  it('asks for a confirmation before starting a replay', () => {
    const hook = mount();

    hook.run(() => hook.current().askWatch(FAVOURITE));

    expect(hook.current().pending).toBe('watch');
    expect(send).not.toHaveBeenCalled();
  });

  it('starts the replay once confirmed', () => {
    const hook = mount();

    hook.run(() => hook.current().askWatch(FAVOURITE));

    hook.run(() => hook.current().confirm());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'play', row: FAVOURITE.id }]);
    expect(hook.current().pending).toBeNull();
  });

  it('forgets a delete request on cancel', () => {
    const hook = mount();

    hook.run(() => hook.current().askRemove(FAVOURITE));

    hook.run(() => hook.current().cancel());

    expect(hook.current().pending).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });

  it('forgets a delete request when another replay is selected', () => {
    const hook = mount();

    hook.run(() => hook.current().askRemove(FAVOURITE));

    hook.run(() => hook.current().select(OTHER_CLIENT.id));

    expect(hook.current().pending).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });

  it('deletes the replay once confirmed', () => {
    const hook = mount();

    hook.run(() => hook.current().select(OTHER_CLIENT.id));
    hook.run(() => hook.current().askRemove(OTHER_CLIENT));

    hook.run(() => hook.current().confirm());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'delete', row: OTHER_CLIENT.id }]);
  });

  it('starts a rename from the current title', () => {
    const hook = mount();

    hook.run(() => hook.current().startRename(FAVOURITE));

    expect(hook.current().draft).toBe('20260927_1405_ussr-R04_T-34_05_prohorovka');
  });

  it('ignores an empty new name', () => {
    const hook = mount();

    hook.run(() => hook.current().startRename(FAVOURITE));
    hook.run(() => hook.current().editRename('   '));

    hook.run(() => hook.current().submitRename());

    expect(send).not.toHaveBeenCalled();
  });

  it('renames with the trimmed text and closes the draft', () => {
    const hook = mount();

    hook.run(() => hook.current().startRename(FAVOURITE));
    hook.run(() => hook.current().editRename('  best battle '));

    hook.run(() => hook.current().submitRename());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'rename', row: FAVOURITE.id, value: 'best battle' }]);
    expect(hook.current().draft).toBeNull();
  });

  it('takes a favourite off the favourites', () => {
    const hook = mount();

    hook.run(() => hook.current().toggleFavourite(FAVOURITE));

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'favourite', row: FAVOURITE.id, value: '0' }]);
  });

  it('adds a replay to the favourites', () => {
    const hook = mount();

    hook.run(() => hook.current().toggleFavourite(OTHER_CLIENT));

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'favourite', row: OTHER_CLIENT.id, value: '1' }]);
  });

  it('uploads a replay', () => {
    const hook = mount();

    hook.run(() => hook.current().upload(OTHER_CLIENT));

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'upload', row: OTHER_CLIENT.id }]);
  });

  it('opens the site page of an uploaded replay', () => {
    const hook = mount();

    hook.run(() => hook.current().openSite(FAVOURITE));

    expect(sent()).toEqual([{ type: 'open', path: '/replays/7b0c2a44-1111-4111-8111-111111111111' }]);
  });

  it('opens nothing for a replay with no site link', () => {
    const hook = mount();

    hook.run(() => hook.current().openSite(OTHER_CLIENT));

    expect(send).not.toHaveBeenCalled();
  });
});
