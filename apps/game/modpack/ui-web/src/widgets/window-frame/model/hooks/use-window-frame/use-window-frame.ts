import { useEffect, useRef, useState } from 'preact/hooks';

import type { ClientSize } from '../../../../../shared/api/gameface';
import type { UiWindow } from '../../../../../shared/api/protocol';
import type { Frame, ResizeEdge } from '../../../lib/frame';
import type { FramePress, Gesture, PersistInput, Pointer } from './use-window-frame.types';

import { send } from '../../../../../shared/api/protocol';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { WINDOW_FRAME } from '../../../config';
import { centredFrame, clampFrame, fitFrame, layoutOf, moveFrame, resizeFrame, toRem, zoomStep } from '../../../lib/frame';
import { readScreen } from '../../../lib/screen';

export const useWindowFrame = (saved: UiWindow | null) => {
  const [screen, setScreen] = useState<ClientSize>(readScreen);
  const [placed, setPlaced] = useState<Frame | null>(null);
  const [chosenZoom, setChosenZoom] = useState<number | null>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const zoom = chosenZoom ?? saved?.zoom ?? WINDOW_FRAME.defaultZoom;
  const frame = placed ? clampFrame({ frame: placed, screen }) : saved ? fitFrame({ saved, screen }) : centredFrame(screen);
  const latestRef = useRef({ frame, zoom, screen });

  latestRef.current = { frame, zoom, screen };

  const persist = (next: PersistInput): void => {
    send({ type: 'window_layout', ...next.frame, zoom: next.zoom, placed: next.placed ?? true });
  };

  const persistRef = useRef(persist);

  persistRef.current = persist;

  useEffect(() => {
    const check = (): void => {
      const next = readScreen();

      setScreen((current) => (current.width === next.width && current.height === next.height ? current : next));
    };

    const follow = ({ clientX, clientY }: Pointer): void => {
      const gesture = gestureRef.current;

      if (!gesture) {
        return;
      }

      const scale = rootScale();
      const dx = (clientX - gesture.startX) / scale;
      const dy = (clientY - gesture.startY) / scale;
      const current = latestRef.current.screen;

      setPlaced(
        gesture.kind === 'move'
          ? moveFrame({ frame: gesture.frame, dx, dy, screen: current })
          : resizeFrame({ frame: gesture.frame, dx, dy, edge: gesture.kind, screen: current })
      );
    };

    const finish = (): void => {
      if (gestureRef.current) {
        gestureRef.current = null;
        persistRef.current(latestRef.current);
      }
    };

    const timer = setInterval(check, WINDOW_FRAME.screenCheckMs);

    window.addEventListener('resize', check);
    window.addEventListener('mousemove', follow);
    window.addEventListener('mouseup', finish);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', check);
      window.removeEventListener('mousemove', follow);
      window.removeEventListener('mouseup', finish);
    };
  }, []);

  const start =
    (kind: Gesture['kind']) =>
    (event: FramePress): void => {
      event.preventDefault();
      gestureRef.current = { kind, startX: event.clientX, startY: event.clientY, frame };
    };

  const changeZoom = (direction: -1 | 1): void => {
    const next = zoomStep({ zoom, direction });

    if (next !== zoom) {
      setChosenZoom(next);
      persist({ frame, zoom: next });
    }
  };

  const layout = layoutOf({ frame, zoom });

  return {
    zoom,
    layout,
    frameStyle: { left: toRem(frame.x), top: toRem(frame.y), width: toRem(frame.width), height: toRem(frame.height) },
    innerStyle: {
      width: toRem(layout.inner.width),
      height: toRem(layout.inner.height),
      ...(layout.scale === 1 ? {} : { transform: `scale(${layout.scale})`, transformOrigin: '0 0' })
    },
    canZoomIn: zoom < Math.max(...WINDOW_FRAME.zoomSteps),
    canZoomOut: zoom > Math.min(...WINDOW_FRAME.zoomSteps),
    zoomIn: () => changeZoom(1),
    zoomOut: () => changeZoom(-1),
    onMoveStart: start('move'),
    onResizeStart: (edge: ResizeEdge) => start(edge),
    onRecentre: () => {
      const centred = centredFrame(screen);

      setPlaced(centred);
      persist({ frame: centred, zoom, placed: false });
    }
  };
};
