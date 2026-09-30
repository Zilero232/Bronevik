// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { KEYS } from '../../../../../../shared/config';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { INT_FIELD } from '../../../../config';
import { useIntField } from '../use-int-field';

const LIMITS = { min: 10, max: 60 };

const mount = (value: number) => {
  const onCommit = vi.fn();

  return { onCommit, hook: renderHook(() => useIntField({ value, ...LIMITS, onCommit })) };
};

describe(useIntField, () => {
  it('shows the value until the player types', () => {
    const { hook } = mount(30);

    expect(hook.current().text).toBe('30');

    hook.run(() => hook.current().edit('4'));

    expect(hook.current().text).toBe('4');
  });

  it('commits the draft clamped to the limits and drops it', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().edit('999'));
    hook.run(() => hook.current().commit());

    expect(onCommit).toHaveBeenCalledWith(LIMITS.max);
    expect(hook.current().text).toBe('30');
  });

  it('shows the range and stops the buttons at the limits', () => {
    expect(mount(30).hook.current()).toMatchObject({ range: '10-60', canDecrease: true, canIncrease: true });
    expect(mount(10).hook.current()).toMatchObject({ canDecrease: false, canIncrease: true });
    expect(mount(60).hook.current()).toMatchObject({ canDecrease: true, canIncrease: false });
  });

  it('commits on Enter', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().edit('42'));
    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(onCommit).toHaveBeenCalledWith(42);
  });

  it('commits nothing for an unchanged or unreadable draft', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().commit());
    hook.run(() => hook.current().edit('abc'));
    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('steps by one and stops at the limits', () => {
    const inside = mount(30);

    inside.hook.run(() => inside.hook.current().increase());

    expect(inside.onCommit).toHaveBeenCalledWith(30 + INT_FIELD.step);

    const atMax = mount(LIMITS.max);

    atMax.hook.run(() => atMax.hook.current().increase());

    expect(atMax.onCommit).not.toHaveBeenCalled();
  });
});
