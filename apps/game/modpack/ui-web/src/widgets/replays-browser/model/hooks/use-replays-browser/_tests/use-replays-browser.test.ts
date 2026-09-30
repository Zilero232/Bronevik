// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pageSample } from '../../../../../../entities/replays/_tests/fixtures';
import { send } from '../../../../../../shared/api/protocol/protocol';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useReplaysBrowser } from '../use-replays-browser';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const PAGE = pageSample();
const NOW = 1_790_600_000;
const [FIRST, SECOND] = PAGE.items;

const mount = (page: unknown = PAGE, enabled = true) => renderHook(() => useReplaysBrowser({ page, enabled, now: NOW }));

const sent = (): unknown[] => vi.mocked(send).mock.calls.map(([message]) => message);

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useReplaysBrowser, () => {
  it('lists the page and selects the first replay', () => {
    const hook = mount();

    expect(hook.current().view).toBe('list');
    expect(hook.current().visible.map((item) => item.id)).toEqual([FIRST?.id, SECOND?.id]);
    expect(hook.current().selected?.id).toBe(FIRST?.id);
  });

  it('tells the states apart: off, unreadable, no account, empty, reading and nothing found', () => {
    expect(mount(PAGE, false).current().view).toBe('off');
    expect(mount(null).current().view).toBe('invalid');
    expect(mount({ kind: 'list' }).current().view).toBe('invalid');
    expect(mount({ ...PAGE, status: 'no_account' }).current().view).toBe('no_account');
    expect(mount({ ...PAGE, items: [] }).current().view).toBe('empty');
    expect(mount({ ...PAGE, status: 'indexing', items: [] }).current().view).toBe('indexing');

    const hook = mount();

    hook.run(() => hook.current().patch({ query: 'nothing like this' }));

    expect(hook.current().view).toBe('nothing');

    hook.run(() => hook.current().reset());

    expect(hook.current().view).toBe('list');
  });

  it('flips the order on a second pick of the same sort', () => {
    const hook = mount();

    hook.run(() => hook.current().sortBy('damage'));

    expect(hook.current().filters).toMatchObject({ sort: 'damage', descending: true });

    hook.run(() => hook.current().sortBy('damage'));

    expect(hook.current().filters).toMatchObject({ sort: 'damage', descending: false });
  });

  it('starts a replay only after the confirmation', () => {
    const hook = mount();
    const item = hook.current().selected;

    if (!item) {
      throw new Error('no replay selected');
    }

    hook.run(() => hook.current().askWatch(item));

    expect(hook.current().pending).toBe('watch');
    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().confirm());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'play', row: item.id }]);
    expect(hook.current().pending).toBeNull();
  });

  it('deletes only after the confirmation and forgets it on cancel or another selection', () => {
    const hook = mount();
    const item = hook.current().selected;

    if (!item || !SECOND) {
      throw new Error('the sample needs two replays');
    }

    hook.run(() => hook.current().askRemove(item));
    hook.run(() => hook.current().cancel());
    hook.run(() => hook.current().askRemove(item));
    hook.run(() => hook.current().select(SECOND.id));

    expect(hook.current().pending).toBeNull();
    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().askRemove(SECOND));
    hook.run(() => hook.current().confirm());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'delete', row: SECOND.id }]);
  });

  it('renames with the trimmed text and ignores an empty one', () => {
    const hook = mount();
    const item = hook.current().selected;

    if (!item) {
      throw new Error('no replay selected');
    }

    hook.run(() => hook.current().startRename(item));

    expect(hook.current().draft).toBe(item.title);

    hook.run(() => hook.current().editRename('   '));
    hook.run(() => hook.current().submitRename());

    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().startRename(item));
    hook.run(() => hook.current().editRename('  best battle '));
    hook.run(() => hook.current().submitRename());

    expect(sent()).toEqual([{ type: 'action', component: 'replay_manager', action: 'rename', row: item.id, value: 'best battle' }]);
    expect(hook.current().draft).toBeNull();
  });

  it('toggles a favourite, uploads and opens the site link of the replay', () => {
    const hook = mount();

    if (!FIRST || !SECOND) {
      throw new Error('the sample needs two replays');
    }

    hook.run(() => hook.current().toggleFavourite(FIRST));
    hook.run(() => hook.current().toggleFavourite(SECOND));
    hook.run(() => hook.current().upload(SECOND));
    hook.run(() => hook.current().openSite(FIRST));
    hook.run(() => hook.current().openSite(SECOND));

    expect(sent()).toEqual([
      { type: 'action', component: 'replay_manager', action: 'favourite', row: FIRST.id, value: '0' },
      { type: 'action', component: 'replay_manager', action: 'favourite', row: SECOND.id, value: '1' },
      { type: 'action', component: 'replay_manager', action: 'upload', row: SECOND.id },
      { type: 'open', path: FIRST.site?.link }
    ]);
  });
});
