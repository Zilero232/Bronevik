// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UiPanel } from '../../../../../../shared/api/protocol';

import { send } from '../../../../../../shared/api/protocol/protocol';
import { dragRect, moveMessage, panelRect } from '../../../../../../shared/lib/hud-geometry';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { HUD_EDITOR } from '../../../../config';
import { useHudEditor } from '../use-hud-editor';

vi.mock('../../../../../../shared/api/protocol/protocol', () => ({ send: vi.fn(() => true) }));

const PANEL: UiPanel = {
  id: 'damage_log',
  title: 'Damage log',
  enabled: true,
  x: 20,
  y: -200,
  align_x: 'left',
  align_y: 'bottom',
  preview: null,
  width: 240,
  height: 90
};

const screen = HUD_EDITOR.defaultScreen;
const key = (name: string) => ({ key: name, preventDefault: vi.fn() });

beforeEach(() => {
  vi.mocked(send).mockClear();
});

describe(useHudEditor, () => {
  it('nudges a panel by the arrow step and sends its new placement', () => {
    const hook = renderHook(() => useHudEditor([PANEL]));
    const press = key('ArrowRight');
    const step = HUD_EDITOR.nudge.ArrowRight ?? { dx: 0, dy: 0 };

    hook.run(() => hook.current().panels[0]?.onKeyDown(press));

    const rect = dragRect({ rect: panelRect({ panel: PANEL, screen }), ...step, screen, grid: HUD_EDITOR.grid });

    expect(press.preventDefault).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledWith(moveMessage({ id: PANEL.id, rect, screen }));
    expect(hook.current().panels[0]?.selected).toBe(true);
  });

  it('leaves other keys to the page', () => {
    const hook = renderHook(() => useHudEditor([PANEL]));
    const press = key('Tab');

    hook.run(() => hook.current().panels[0]?.onKeyDown(press));

    expect(press.preventDefault).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('resets only the selected panel', () => {
    const hook = renderHook(() => useHudEditor([PANEL]));

    hook.run(() => hook.current().resetSelected());

    expect(send).not.toHaveBeenCalled();

    hook.run(() => hook.current().panels[0]?.onMouseDown({ clientX: 0, clientY: 0 }));
    hook.run(() => hook.current().resetSelected());

    expect(hook.current().hasSelection).toBe(true);
    expect(send).toHaveBeenCalledWith({ type: 'hud_reset', panel: PANEL.id });
  });

  it('places each panel on the stage in screen percentages', () => {
    const hook = renderHook(() => useHudEditor([PANEL]));

    expect(hook.current().panels[0]?.style.left).toBe(`${(PANEL.x / screen.width) * 100}%`);
  });
});
