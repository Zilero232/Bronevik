// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { renderHook } from '../../testing/render-hook';
import { useWindowEvent } from '../use-window-event';

const pressWindow = (): void => {
  window.dispatchEvent(new MouseEvent('mousedown'));
};

describe(useWindowEvent, () => {
  it('passes a window event to the handler', () => {
    const handler = vi.fn();

    renderHook(() => useWindowEvent({ type: 'mousedown', handler }));
    pressWindow();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('stops listening once the component unmounts', () => {
    const handler = vi.fn();
    const hook = renderHook(() => useWindowEvent({ type: 'mousedown', handler }));

    hook.unmount();
    pressWindow();

    expect(handler).not.toHaveBeenCalled();
  });
});
