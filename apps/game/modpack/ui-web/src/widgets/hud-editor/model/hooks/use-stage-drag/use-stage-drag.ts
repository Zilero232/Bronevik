import { useWindowEvent } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';
import { funnel } from 'remeda';

import type { UiMessageOf } from '../../../../../shared/api/protocol';
import type { Drag, LiveRect } from '../../../../../shared/lib/hud-geometry';
import type { UseStageDragInput } from './use-stage-drag.types';

import { send } from '../../../../../shared/api/protocol';
import { dragTo, moveMessage } from '../../../../../shared/lib/hud-geometry';
import { HUD_EDITOR } from '../../../config';

type MoveMessage = UiMessageOf<'hud_move'>;

export const useStageDrag = ({ screenRef }: UseStageDragInput) => {
  const dragRef = useRef<Drag | null>(null);
  const [live, setLive] = useState<LiveRect | null>(null);
  const [mover] = useState(() =>
    funnel((message: MoveMessage) => send(message), {
      reducer: (_: MoveMessage | undefined, message: MoveMessage) => message,
      minGapMs: HUD_EDITOR.moveThrottleMs,
      triggerAt: 'both'
    })
  );

  const moveNow = (message: MoveMessage): void => {
    mover.call(message);
    mover.flush();
  };

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

      if (!moved) {
        return;
      }

      const message = moveMessage({ ...moved, screen: screenRef.current });

      if (final) {
        moveNow(message);
      } else {
        mover.call(message);
      }
    };

  useWindowEvent('mousemove', follow(false));
  useWindowEvent('mouseup', follow(true));

  return {
    live,
    moveNow,
    startDrag: (drag: Drag) => {
      dragRef.current = drag;
    }
  };
};
