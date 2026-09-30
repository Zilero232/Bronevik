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
  it('shows the value before the player types', () => {
    const { hook } = mount(30);

    expect(hook.current().text).toBe('30');
  });

  it('shows the draft while the player types', () => {
    const { hook } = mount(30);

    hook.run(() => hook.current().edit('4'));

    expect(hook.current().text).toBe('4');
  });

  it('commits the draft clamped to the limits', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().edit('999'));
    hook.run(() => hook.current().commit());

    expect(onCommit).toHaveBeenCalledWith(LIMITS.max);
  });

  it('drops the draft once it is committed', () => {
    const { hook } = mount(30);

    hook.run(() => hook.current().edit('999'));
    hook.run(() => hook.current().commit());

    expect(hook.current().text).toBe('30');
  });

  it('shows the range and enables both buttons inside the limits', () => {
    expect(mount(30).hook.current()).toMatchObject({ range: '10-60', canDecrease: true, canIncrease: true });
  });

  it('disables decreasing at the lower limit', () => {
    expect(mount(10).hook.current()).toMatchObject({ canDecrease: false, canIncrease: true });
  });

  it('disables increasing at the upper limit', () => {
    expect(mount(60).hook.current()).toMatchObject({ canDecrease: true, canIncrease: false });
  });

  it('commits on Enter', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().edit('42'));
    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(onCommit).toHaveBeenCalledWith(42);
  });

  it('commits nothing when nothing was typed', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('commits nothing for an unreadable draft', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().edit('abc'));
    hook.run(() => hook.current().commit());

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('steps up by one inside the limits', () => {
    const { hook, onCommit } = mount(30);

    hook.run(() => hook.current().increase());

    expect(onCommit).toHaveBeenCalledWith(30 + INT_FIELD.step);
  });

  it('does not step past the upper limit', () => {
    const { hook, onCommit } = mount(LIMITS.max);

    hook.run(() => hook.current().increase());

    expect(onCommit).not.toHaveBeenCalled();
  });
});
