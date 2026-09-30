// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UiAction, UiComponent } from '../../../../../../shared/api/protocol';

import { send } from '../../../../../../shared/api/protocol/protocol';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useComponentCard } from '../use-component-card';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const action = (overrides: Partial<UiAction>): UiAction => ({ id: 'clear', label: 'Clear', ...overrides });

const component = (overrides: Partial<UiComponent> = {}): UiComponent => ({
  id: 'replay_manager',
  group: 'hangar',
  section: 'replays',
  context: 'hangar',
  title: 'Replays',
  hint: null,
  switch: { key: 'hangar_replay_manager', value: true },
  fields: [],
  panel: false,
  actions: [],
  page: null,
  ...overrides
});

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useComponentCard, () => {
  it('runs an action without a confirmation at once', () => {
    const hook = renderHook(() => useComponentCard({ component: component({ actions: [action({})] }) }));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(send).toHaveBeenCalledWith({ type: 'action', component: 'replay_manager', action: 'clear' });
  });

  it('asks first when the action carries a confirmation, and sends on confirm', () => {
    const hook = renderHook(() => useComponentCard({ component: component({ actions: [action({ confirm: 'Sure?' })] }) }));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(hook.current().confirmText).toBe('Sure?');
    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().confirm());

    expect(send).toHaveBeenCalledOnce();
    expect(hook.current().confirmText).toBeNull();
  });

  it('drops the pending action on cancel', () => {
    const hook = renderHook(() => useComponentCard({ component: component({ actions: [action({ confirm: 'Sure?' })] }) }));

    hook.run(() => hook.current().actionItems[0]?.onClick());
    hook.run(() => hook.current().cancel());

    expect(hook.current().confirmText).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });

  it('opens a site link instead of calling the component', () => {
    const hook = renderHook(() => useComponentCard({ component: component({ actions: [action({ link: '/me/replays' })] }) }));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(send).toHaveBeenCalledWith({ type: 'open', path: '/me/replays' });
  });

  it('flips the switch through a set message and remembers it for undo', () => {
    const hook = renderHook(() => useComponentCard({ component: component() }));

    hook.run(() => hook.current().toggle());

    expect(send).toHaveBeenCalledWith({ type: 'set', component: 'replay_manager', key: 'hangar_replay_manager', value: false });
  });

  it('shows the empty note only without fields, actions and a page', () => {
    expect(renderHook(() => useComponentCard({ component: component({ panel: true }) })).current().showEmpty).toBe(true);

    expect(renderHook(() => useComponentCard({ component: component({ page: { kind: 'list', empty: '', rows: [] } }) })).current().showEmpty).toBe(
      false
    );
  });

  it('opens only a card with something inside, and a search result always', () => {
    expect(renderHook(() => useComponentCard({ component: component() })).current().expandable).toBe(false);
    expect(renderHook(() => useComponentCard({ component: component({ actions: [action({})] }) })).current().open).toBe(false);
    expect(renderHook(() => useComponentCard({ component: component({ actions: [action({})] }), forceOpen: true })).current().open).toBe(true);
  });

  it('marks where the component works', () => {
    const badges = renderHook(() => useComponentCard({ component: component({ context: 'any' }) })).current().badges;

    expect(badges.map(({ key }) => key)).toEqual(['contextHangar', 'contextBattle']);
  });
});
