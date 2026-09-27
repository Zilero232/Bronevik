// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UiProfiles } from '../../../../../../shared/api/protocol';

import { send } from '../../../../../../shared/api/protocol/protocol';
import { KEYS } from '../../../../../../shared/config';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useProfiles } from '../use-profiles';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const PROFILES: UiProfiles = {
  active: 'p1',
  items: [
    { id: 'p1', name: 'Streams', updated: 1 },
    { id: 'p2', name: 'Ranked', updated: 2 }
  ]
};

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useProfiles, () => {
  it('saves a new profile under the trimmed name on Enter and clears the field', () => {
    const hook = renderHook(() => useProfiles(PROFILES));

    hook.run(() => hook.current().setName('  Night  '));
    hook.run(() => hook.current().onNameKey(KEYS.enter));

    expect(send).toHaveBeenCalledWith({ type: 'profile_save', name: 'Night' });
    expect(hook.current().name).toBe('');
  });

  it('ignores a blank name and a blank import code', () => {
    const hook = renderHook(() => useProfiles(PROFILES));

    hook.run(() => hook.current().setName('   '));
    hook.run(() => hook.current().saveNew());
    hook.run(() => hook.current().importProfile());

    expect(send).not.toHaveBeenCalled();
  });

  it('marks the active profile and overwrites a profile under its own name', () => {
    const hook = renderHook(() => useProfiles(PROFILES));

    expect(hook.current().rows.map((row) => row.active)).toEqual([true, false]);

    hook.run(() => hook.current().rows[1]?.overwrite());

    expect(send).toHaveBeenCalledWith({ type: 'profile_save', name: 'Ranked', id: 'p2' });
  });

  it('renames one row at a time and sends the trimmed name', () => {
    const hook = renderHook(() => useProfiles(PROFILES));

    hook.run(() => hook.current().rows[0]?.startRename());

    expect(hook.current().rows.map((row) => row.renameValue)).toEqual(['Streams', null]);

    hook.run(() => hook.current().rows[0]?.editRename(' Stream nights '));
    hook.run(() => hook.current().rows[0]?.commitRename());

    expect(send).toHaveBeenCalledWith({ type: 'profile_rename', id: 'p1', name: 'Stream nights' });
    expect(hook.current().rows[0]?.renameValue).toBeNull();
  });

  it('deletes only after the confirmation', () => {
    const hook = renderHook(() => useProfiles(PROFILES));

    hook.run(() => hook.current().rows[1]?.askDelete());

    expect(hook.current().deleting).toBe(true);
    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().confirmDelete());

    expect(send).toHaveBeenCalledWith({ type: 'profile_delete', id: 'p2' });
    expect(hook.current().deleting).toBe(false);
  });
});
