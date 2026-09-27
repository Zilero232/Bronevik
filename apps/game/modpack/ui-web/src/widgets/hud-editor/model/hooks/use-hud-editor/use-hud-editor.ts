import { useEffect, useRef, useState } from 'preact/hooks';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { UiPanel } from '../../../../../shared/api/protocol';
import type { Drag, LiveRect } from '../../../lib/geometry';
import type { KeyPress, PointerPress } from './use-hud-editor.types';

import { gameface } from '../../../../../shared/api/gameface';
import { send } from '../../../../../shared/api/protocol';
import { createThrottle } from '../../../../../shared/lib/throttle';
import { HUD_EDITOR } from '../../../config';
import { dragRect, dragTo, moveMessage, panelRect, stageBox, stageScale } from '../../../lib/geometry';

export const useHudEditor = (panels: UiPanel[]) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const screenRef = useRef<ClientSize>(HUD_EDITOR.defaultScreen);
  const [throttle] = useState(() => createThrottle(HUD_EDITOR.moveThrottleMs));
  const [live, setLive] = useState<LiveRect | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  screenRef.current = gameface.clientSize() ?? HUD_EDITOR.defaultScreen;

  useEffect(() => {
    const follow =
      (final: boolean) =>
      (event: MouseEvent): void => {
        const drag = dragRef.current;
        const moved = drag && dragTo({ drag, pointer: { x: event.clientX, y: event.clientY }, screen: screenRef.current, grid: HUD_EDITOR.grid });

        if (final) {
          dragRef.current = null;
          setLive(null);
        } else if (moved) {
          setLive(moved);
        }

        if (moved && throttle(final)) {
          send(moveMessage({ ...moved, screen: screenRef.current }));
        }
      };

    const onMove = follow(false);
    const onUp = follow(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [throttle]);

  const screen = screenRef.current;

  return {
    stageRef,
    hasPanels: panels.length > 0,
    hasSelection: selected !== null,
    editOnScreen: () => send({ type: 'hud_edit', active: true }),
    resetSelected: () => {
      if (selected) {
        send({ type: 'hud_reset', panel: selected });
      }
    },
    panels: panels.map((panel) => ({
      panel,
      selected: selected === panel.id,
      style: stageBox({ rect: live?.id === panel.id ? live.rect : panelRect({ panel, screen }), screen }),
      onMouseDown: ({ clientX, clientY }: PointerPress) => {
        const box = stageRef.current?.getBoundingClientRect();

        setSelected(panel.id);

        if (box) {
          const scale = stageScale({ screen, stage: { width: box.width, height: box.height } });

          dragRef.current = { id: panel.id, mouseX: clientX, mouseY: clientY, scale, rect: panelRect({ panel, screen }) };
        }
      },
      onKeyDown: (event: KeyPress) => {
        const step = HUD_EDITOR.nudge[event.key];

        if (!step) {
          return;
        }

        event.preventDefault();
        setSelected(panel.id);
        throttle(true);
        send(moveMessage({ id: panel.id, rect: dragRect({ rect: panelRect({ panel, screen }), ...step, screen, grid: HUD_EDITOR.grid }), screen }));
      }
    }))
  };
};
