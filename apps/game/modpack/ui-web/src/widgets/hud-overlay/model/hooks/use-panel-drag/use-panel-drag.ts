import { useEffect, useRef, useState } from 'preact/hooks';

import type { LiveRect } from '../../../../../shared/lib/hud-geometry';
import type { OverlayDrag, PanelPress, StartDragInput, UsePanelDragInput } from './use-panel-drag.types';

import { sendHud } from '../../../../../shared/api/hud-protocol';
import { dragTo, placementOf } from '../../../../../shared/lib/hud-geometry';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { HUD_OVERLAY } from '../../../config';
import { readScreen } from '../../../lib/overlay-screen';

const liveAt = (drag: OverlayDrag, { clientX, clientY }: PanelPress): LiveRect =>
  dragTo({ drag, pointer: { x: clientX, y: clientY }, screen: readScreen(), grid: HUD_OVERLAY.grid }) ?? { id: drag.id, rect: drag.rect };

const beyondSlop = (drag: OverlayDrag, event: PanelPress): boolean =>
  Math.abs(event.clientX - drag.mouseX) > HUD_OVERLAY.clickSlop || Math.abs(event.clientY - drag.mouseY) > HUD_OVERLAY.clickSlop;

export const usePanelDrag = ({ edit, onMoved }: UsePanelDragInput) => {
  const [live, setLive] = useState<LiveRect | null>(null);
  const dragRef = useRef<OverlayDrag | null>(null);
  const lastRef = useRef<PanelPress | null>(null);

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

    const placement = placementOf({ rect: liveAt(drag, event).rect, screen: readScreen() });

    onMoved({ id: drag.id, placement });
    sendHud({ type: 'moved', id: drag.id, ...placement });
  };

  const finishRef = useRef(finish);

  finishRef.current = finish;

  useEffect(() => {
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

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    const drag = dragRef.current;

    if (!edit && drag) {
      finishRef.current(lastRef.current ?? { clientX: drag.mouseX, clientY: drag.mouseY });
    }
  }, [edit]);

  const startDrag = ({ id, press, rect, button }: StartDragInput): void => {
    dragRef.current = { id, mouseX: press.clientX, mouseY: press.clientY, scale: rootScale(), rect, moved: false, button };
    setLive({ id, rect });
  };

  return { live, startDrag };
};
