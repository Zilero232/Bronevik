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
    const hook = renderHook(() => useComponentCard(component({ actions: [action({})] })));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(send).toHaveBeenCalledWith({ type: 'action', component: 'replay_manager', action: 'clear' });
  });

  it('asks first when the action carries a confirmation, and sends on confirm', () => {
    const hook = renderHook(() => useComponentCard(component({ actions: [action({ confirm: 'Sure?' })] })));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(hook.current().confirmText).toBe('Sure?');
    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().confirm());

    expect(send).toHaveBeenCalledOnce();
    expect(hook.current().confirmText).toBeNull();
  });

  it('drops the pending action on cancel', () => {
    const hook = renderHook(() => useComponentCard(component({ actions: [action({ confirm: 'Sure?' })] })));

    hook.run(() => hook.current().actionItems[0]?.onClick());
    hook.run(() => hook.current().cancel());

    expect(hook.current().confirmText).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });

  it('opens a site link instead of calling the component', () => {
    const hook = renderHook(() => useComponentCard(component({ actions: [action({ link: '/me/replays' })] })));

    hook.run(() => hook.current().actionItems[0]?.onClick());

    expect(send).toHaveBeenCalledWith({ type: 'open', path: '/me/replays' });
  });

  it('flips the switch through a set message', () => {
    const hook = renderHook(() => useComponentCard(component()));

    hook.run(() => hook.current().toggle());

    expect(send).toHaveBeenCalledWith({ type: 'set', component: 'replay_manager', key: 'hangar_replay_manager', value: false });
  });

  it('shows the empty note only without fields and without a page', () => {
    expect(renderHook(() => useComponentCard(component())).current().showEmpty).toBe(true);
    expect(renderHook(() => useComponentCard(component({ page: { kind: 'list', empty: '', rows: [] } }))).current().showEmpty).toBe(false);
  });
});
