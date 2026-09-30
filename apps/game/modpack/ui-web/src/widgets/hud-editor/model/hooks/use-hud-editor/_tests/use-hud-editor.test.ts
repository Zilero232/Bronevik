// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UiPanel } from '../../../../../../shared/api/protocol';

import { send } from '../../../../../../shared/api/protocol/protocol';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useHudEditor } from '../use-hud-editor';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const panel = (overrides: Partial<UiPanel> = {}): UiPanel => ({
  id: 'damage_log',
  title: 'Damage log',
  enabled: true,
  x: 20,
  y: -200,
  align_x: 'left',
  align_y: 'bottom',
  preview: null,
  width: 240,
  height: 90,
  ...overrides
});

const key = (name: string) => ({ key: name, preventDefault: vi.fn() });

const mountEditor = (panels: UiPanel[] = [panel()]) => renderHook(() => useHudEditor(panels));

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useHudEditor, () => {
  it('takes an arrow key from the page', () => {
    const hook = mountEditor();
    const press = key('ArrowRight');

    hook.run(() => hook.current().panels[0]?.onKeyDown(press));

    expect(press.preventDefault).toHaveBeenCalledOnce();
  });

  it('nudges a panel by the arrow step on the grid and sends its new placement', () => {
    const hook = mountEditor();

    hook.run(() => hook.current().panels[0]?.onKeyDown(key('ArrowRight')));

    expect(send).toHaveBeenCalledWith({ type: 'hud_move', panel: 'damage_log', x: 24, y: -198, align_x: 'left', align_y: 'bottom' });
  });

  it('selects the nudged panel', () => {
    const hook = mountEditor();

    hook.run(() => hook.current().panels[0]?.onKeyDown(key('ArrowRight')));

    expect(hook.current().panels[0]?.selected).toBe(true);
  });

  it('leaves other keys to the page', () => {
    const hook = mountEditor();
    const press = key('Tab');

    hook.run(() => hook.current().panels[0]?.onKeyDown(press));

    expect(press.preventDefault).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('resets nothing while no panel is selected', () => {
    const hook = mountEditor();

    hook.run(() => hook.current().resetSelected());

    expect(send).not.toHaveBeenCalled();
  });

  it('resets the selected panel', () => {
    const hook = mountEditor();

    hook.run(() => hook.current().panels[0]?.onMouseDown({ clientX: 0, clientY: 0 }));

    hook.run(() => hook.current().resetSelected());

    expect(hook.current().hasSelection).toBe(true);
    expect(send).toHaveBeenCalledWith({ type: 'hud_reset', panel: 'damage_log' });
  });

  it('places each panel on the stage in screen percentages', () => {
    const hook = mountEditor([panel({ x: 192 })]);

    expect(hook.current().panels[0]?.style.left).toBe('10%');
  });
});
