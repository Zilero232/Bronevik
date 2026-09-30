import { useRef, useState } from 'preact/hooks';

import type { Drag, LiveRect } from '../../../../../shared/lib/hud-geometry';
import type { UseStageDragInput } from './use-stage-drag.types';

import { send } from '../../../../../shared/api/protocol';
import { dragTo, moveMessage } from '../../../../../shared/lib/hud-geometry';
import { useWindowEvent } from '../../../../../shared/lib/use-window-event';
import { HUD_EDITOR } from '../../../config';

export const useStageDrag = ({ screenRef, throttle }: UseStageDragInput) => {
  const dragRef = useRef<Drag | null>(null);
  const [live, setLive] = useState<LiveRect | null>(null);

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

  useWindowEvent({ type: 'mousemove', handler: follow(false) });
  useWindowEvent({ type: 'mouseup', handler: follow(true) });

  return {
    live,
    startDrag: (drag: Drag) => {
      dragRef.current = drag;
    }
  };
};
