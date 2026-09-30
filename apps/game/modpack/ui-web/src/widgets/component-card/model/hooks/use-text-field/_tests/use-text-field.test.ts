// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { KEYS } from '../../../../../../shared/config';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useTextField } from '../use-text-field';

const mount = (value: string) => {
  const onCommit = vi.fn();

  return { onCommit, hook: renderHook(() => useTextField({ value, onCommit })) };
};

describe(useTextField, () => {
  it('keeps the typed text until it is committed on Enter', () => {
    const { hook, onCommit } = mount('{damage}');

    hook.run(() => hook.current().edit('{damage} / {assist}'));

    expect(hook.current().text).toBe('{damage} / {assist}');
    expect(onCommit).not.toHaveBeenCalled();

    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(onCommit).toHaveBeenCalledWith('{damage} / {assist}');
    expect(hook.current().text).toBe('{damage}');
  });

  it('sends nothing when the text did not change', () => {
    const { hook, onCommit } = mount('abc');

    hook.run(() => hook.current().commit());
    hook.run(() => hook.current().edit('abc'));
    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });
});
