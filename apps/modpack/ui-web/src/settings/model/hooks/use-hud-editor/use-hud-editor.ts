import { useEffect, useRef, useState } from 'preact/hooks';

import type { Rect } from '../../hud/geometry.types';
import type { UiPanel } from '../../protocol/protocol.types';
import type { Drag, MoveInput, NudgeInput, PlacedPanel, StartDragInput } from './use-hud-editor.types';

import { gameface } from '../../../../shared/gameface/gameface';
import { dragRect, panelRect, placementOf, stageScale } from '../../hud/geometry';
import { GEOMETRY } from '../../hud/geometry.constants';
import { send } from '../../protocol/protocol';

export const useHudEditor = (panels: UiPanel[]) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const lastSentRef = useRef(0);
  const [live, setLive] = useState<{ id: string; rect: Rect } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const screen = gameface.clientSize() ?? GEOMETRY.defaultScreen;

  const sendMove = ({ id, rect, final }: MoveInput): void => {
    const now = Date.now();

    if (!final && now - lastSentRef.current < GEOMETRY.moveThrottleMs) {
      return;
    }

    lastSentRef.current = now;
    send({ type: 'hud_move', panel: id, ...placementOf({ rect, screen }) });
  };

  const dragged = (event: MouseEvent): { id: string; rect: Rect } | null => {
    const current = dragRef.current;

    if (!current || current.scale <= 0) {
      return null;
    }

    const dx = (event.clientX - current.mouseX) / current.scale;
    const dy = (event.clientY - current.mouseY) / current.scale;

    return { id: current.id, rect: dragRect({ rect: current.rect, dx, dy, screen, grid: GEOMETRY.grid }) };
  };

  useEffect(() => {
    const onMove = (event: MouseEvent): void => {
      const moved = dragged(event);

      if (moved) {
        setLive(moved);
        sendMove({ ...moved, final: false });
      }
    };

    const onUp = (event: MouseEvent): void => {
      const moved = dragged(event);

      dragRef.current = null;
      setLive(null);

      if (moved) {
        sendMove({ ...moved, final: true });
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  });

  const placed: PlacedPanel[] = panels.map((panel) => ({
    panel,
    rect: live?.id === panel.id ? live.rect : panelRect({ panel, screen })
  }));

  return {
    stageRef,
    screen,
    placed,
    selected,
    startDrag: ({ id, mouseX, mouseY }: StartDragInput) => {
      const panel = panels.find((item) => item.id === id);
      const box = stageRef.current?.getBoundingClientRect();

      setSelected(id);

      if (panel && box) {
        const scale = stageScale({ screen, stage: { width: box.width, height: box.height } });

        dragRef.current = { id, mouseX, mouseY, scale, rect: panelRect({ panel, screen }) };
      }
    },
    nudge: ({ id, key }: NudgeInput) => {
      const panel = panels.find((item) => item.id === id);
      const step = GEOMETRY.nudge[key];

      if (panel && step) {
        const rect = dragRect({ rect: panelRect({ panel, screen }), dx: step.dx, dy: step.dy, screen, grid: GEOMETRY.grid });

        setSelected(id);
        sendMove({ id, rect, final: true });
      }
    },
    reset: (id: string) => send({ type: 'hud_reset', panel: id }),
    editOnScreen: () => send({ type: 'hud_edit', active: true })
  };
};
