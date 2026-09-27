// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import type { UiRow } from '../../../../../../shared/api/protocol';

import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useListPage } from '../use-list-page';

const RENAME = { id: 'rename', label: 'Rename', input: 'old name' };
const DELETE = { id: 'delete', label: 'Delete' };

const ROWS: UiRow[] = [
  { id: 'a', title: 'First', details: [{ label: 'Damage', value: '1 200' }], actions: [RENAME, DELETE] },
  { id: 'b', title: 'Second', actions: [DELETE] }
];

const mount = () => {
  const onRun = vi.fn();

  return { onRun, hook: renderHook(() => useListPage({ rows: ROWS, onRun })) };
};

describe(useListPage, () => {
  it('runs an action without input at once', () => {
    const { hook, onRun } = mount();

    hook.run(() => hook.current()[1]?.actions[0]?.onClick());

    expect(onRun).toHaveBeenCalledWith({ action: DELETE, row: 'b' });
  });

  it('opens an editor with the preset value for an action with input and submits the edit', () => {
    const { hook, onRun } = mount();

    hook.run(() => hook.current()[0]?.actions[0]?.onClick());

    expect(hook.current()[0]?.draftValue).toBe(RENAME.input);
    expect(hook.current()[1]?.draftValue).toBeNull();

    hook.run(() => hook.current()[0]?.editDraft('new name'));
    hook.run(() => hook.current()[0]?.submit());

    expect(onRun).toHaveBeenCalledWith({ action: RENAME, row: 'a', value: 'new name' });
    expect(hook.current()[0]?.draftValue).toBeNull();
  });

  it('closes the editor on cancel without running anything', () => {
    const { hook, onRun } = mount();

    hook.run(() => hook.current()[0]?.actions[0]?.onClick());
    hook.run(() => hook.current()[0]?.cancel());

    expect(hook.current()[0]?.draftValue).toBeNull();
    expect(onRun).not.toHaveBeenCalled();
  });

  it('keeps one row of details open at a time', () => {
    const { hook } = mount();

    expect(hook.current().map((row) => row.hasDetails)).toEqual([true, false]);

    hook.run(() => hook.current()[0]?.toggleDetails());

    expect(hook.current()[0]?.detailsOpen).toBe(true);

    hook.run(() => hook.current()[0]?.toggleDetails());

    expect(hook.current()[0]?.detailsOpen).toBe(false);
  });
});
