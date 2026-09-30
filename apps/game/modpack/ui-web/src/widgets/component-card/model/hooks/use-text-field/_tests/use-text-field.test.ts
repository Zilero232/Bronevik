// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { KEYS } from '../../../../../../shared/config';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useTextField } from '../use-text-field';

const TYPED = '{damage} / {assist}';

const mount = (value: string) => {
  const onCommit = vi.fn();

  return { onCommit, hook: renderHook(() => useTextField({ value, onCommit })) };
};

describe(useTextField, () => {
  it('keeps the typed text without committing it', () => {
    const { hook, onCommit } = mount('{damage}');

    hook.run(() => hook.current().edit(TYPED));

    expect(hook.current().text).toBe(TYPED);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('commits the typed text on Enter', () => {
    const { hook, onCommit } = mount('{damage}');

    hook.run(() => hook.current().edit(TYPED));
    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(onCommit).toHaveBeenCalledWith(TYPED);
  });

  it('shows the value again once the draft is committed', () => {
    const { hook } = mount('{damage}');

    hook.run(() => hook.current().edit(TYPED));
    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(hook.current().text).toBe('{damage}');
  });

  it('sends nothing when nothing was typed', () => {
    const { hook, onCommit } = mount('abc');

    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('sends nothing when the typed text equals the value', () => {
    const { hook, onCommit } = mount('abc');

    hook.run(() => hook.current().edit('abc'));
    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });
});
