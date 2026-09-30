// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { send } from '../../../../../../shared/api/protocol/protocol';
import { KEYS } from '../../../../../../shared/config';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useBindForm } from '../use-bind-form';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useBindForm, () => {
  it('sends the trimmed code and clears the field', () => {
    const hook = renderHook(useBindForm);

    hook.run(() => hook.current().setCode('  ABCD-1234 '));

    expect(hook.current().canBind).toBe(true);

    hook.run(() => hook.current().bind());

    expect(send).toHaveBeenCalledWith({ type: 'bind', code: 'ABCD-1234' });
    expect(hook.current().code).toBe('');
  });

  it('sends nothing for a blank code', () => {
    const hook = renderHook(useBindForm);

    hook.run(() => hook.current().setCode('   '));
    hook.run(() => hook.current().bind());

    expect(send).not.toHaveBeenCalled();
  });

  it('binds on Enter', () => {
    const hook = renderHook(useBindForm);

    hook.run(() => hook.current().setCode('CODE'));
    hook.run(() => hook.current().onKey(KEYS.enter));

    expect(send).toHaveBeenCalledWith({ type: 'bind', code: 'CODE' });
  });
});
