import { useEffect, useRef, useState } from 'preact/hooks';

import type { LiveRect } from '../../../../../shared/lib/hud-geometry';
import type { OverlayDrag, PanelPress, StartDragInput, UsePanelDragInput } from './use-panel-drag.types';

import { sendHud } from '../../../../../shared/api/hud-protocol';
import { dragTo, placementOf } from '../../../../../shared/lib/hud-geometry';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { HUD_OVERLAY } from '../../../config';
import { hitPanel, pointerPoint } from '../../../lib/hit-panel';
import { readScreen } from '../../../lib/overlay-screen';
import { wheelScale } from '../../../lib/panel-size';

const liveAt = (drag: OverlayDrag, { clientX, clientY }: PanelPress): LiveRect =>
  dragTo({ drag, pointer: { x: clientX, y: clientY }, screen: readScreen(), grid: HUD_OVERLAY.grid }) ?? { id: drag.id, rect: drag.rect };

const beyondSlop = (drag: OverlayDrag, event: PanelPress): boolean =>
  Math.abs(event.clientX - drag.mouseX) > HUD_OVERLAY.clickSlop || Math.abs(event.clientY - drag.mouseY) > HUD_OVERLAY.clickSlop;

// Presses and wheel turns are read on the window and hit-tested against the panels' rects, never through the panel
// elements: in edit mode the input area is the whole screen, and a widget's icons, plates or SVG under the pointer
// then cannot swallow the press (or start the engine's own image drag).
export const usePanelDrag = ({ edit, targets, onMoved, onScaled }: UsePanelDragInput) => {
  const [live, setLive] = useState<LiveRect | null>(null);
  const dragRef = useRef<OverlayDrag | null>(null);
  const lastRef = useRef<PanelPress | null>(null);
  const editRef = useRef(edit);
  const targetsRef = useRef(targets);
  const callbacksRef = useRef({ onMoved, onScaled });

  editRef.current = edit;
  targetsRef.current = targets;
  callbacksRef.current = { onMoved, onScaled };

  const finish = (event: PanelPress): void => {
    const drag = dragRef.current;

    if (!drag) {
      return;
    }

    dragRef.current = null;
    lastRef.current = null;
    setLive(null);

    if (drag.button && !drag.moved && !beyondSlop(drag, event)) {
      sendHud({ type: 'pressed', id: drag.id });

      return;
    }

    if (!drag.moved && !beyondSlop(drag, event)) {
      return;
    }

    const placement = placementOf({ rect: liveAt(drag, event).rect, screen: readScreen() });

    callbacksRef.current.onMoved({ id: drag.id, placement });
    sendHud({ type: 'moved', id: drag.id, ...placement });
  };

  const finishRef = useRef(finish);

  finishRef.current = finish;

  const startDrag = ({ id, press, rect, button }: StartDragInput): void => {
    dragRef.current = { id, mouseX: press.clientX, mouseY: press.clientY, scale: rootScale(), rect, moved: false, button };
    setLive({ id, rect });
  };

  const startRef = useRef(startDrag);

  startRef.current = startDrag;

  useEffect(() => {
    const hitAt = (event: PanelPress) =>
      editRef.current
        ? hitPanel({ targets: targetsRef.current(), point: pointerPoint({ clientX: event.clientX, clientY: event.clientY, scale: rootScale() }) })
        : null;

    const onDown = (event: MouseEvent): void => {
      const target = hitAt(event);

      if (!target || event.button > 0) {
        return;
      }

      event.preventDefault();
      startRef.current({ id: target.id, press: event, rect: target.rect, button: target.button });
    };

    const onMove = (event: MouseEvent): void => {
      const drag = dragRef.current;

      if (!drag) {
        return;
      }

      drag.moved = drag.moved || beyondSlop(drag, event);
      lastRef.current = { clientX: event.clientX, clientY: event.clientY };
      setLive(liveAt(drag, event));
    };

    const onUp = (event: MouseEvent): void => finishRef.current(event);

    const onWheel = (event: WheelEvent): void => {
      const target = hitAt(event);
      const found = target && targetsRef.current().find((item) => item.id === target.id);

      if (!found) {
        return;
      }

      event.preventDefault();

      const next = wheelScale({ current: found.scale, deltaY: event.deltaY });

      if (next !== found.scale) {
        callbacksRef.current.onScaled({ id: found.id, scale: next });
        sendHud({ type: 'resized', id: found.id, scale: next });
      }
    };

    const onDragStart = (event: Event): void => {
      if (editRef.current) {
        event.preventDefault();
      }
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('dragstart', onDragStart);

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  useEffect(() => {
    const drag = dragRef.current;

    if (!edit && drag) {
      finishRef.current(lastRef.current ?? { clientX: drag.mouseX, clientY: drag.mouseY });
    }
  }, [edit]);

  return { live };
};
