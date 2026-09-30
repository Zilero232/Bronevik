import { useEffect, useRef } from 'preact/hooks';

import type { Gesture, Handles, Pointer, UseFrameGestureInput } from './use-frame-gesture.types';

import { reportOnce } from '../../../../../shared/lib/page-diag';
import { FRAME_GESTURE } from '../../../config';
import { describeFrame } from '../../../lib/describe';
import { boundsOf, moveFrame, resizeFrame } from '../../../lib/frame';
import { gestureAt } from '../../../lib/hit';

const pointText = ({ clientX, clientY }: Pointer): string => `${Math.round(clientX)},${Math.round(clientY)} px`;

export const useFrameGesture = (input: UseFrameGestureInput): Handles => {
  const moveRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(input);
  const gestureRef = useRef<Gesture | null>(null);
  const lastEventRef = useRef<Event | null>(null);

  inputRef.current = input;

  useEffect(() => {
    const fresh = (event: Event): boolean => {
      if (lastEventRef.current === event) {
        return false;
      }

      lastEventRef.current = event;

      return true;
    };

    const press = (event: MouseEvent): void => {
      if (!fresh(event) || event.button > 0) {
        return;
      }

      const drawn: Handles = { move: moveRef, corner: cornerRef, right: rightRef, bottom: bottomRef };
      const targets = FRAME_GESTURE.handleOrder.map((kind) => ({ kind, rect: drawn[kind].current?.getBoundingClientRect() ?? null }));
      const kind = gestureAt({ targets, x: event.clientX, y: event.clientY });

      reportOnce({ kind: 'mousedown', text: `${pointText(event)} on ${kind ?? 'content'}` });

      if (kind) {
        event.preventDefault();
        gestureRef.current = { kind, startX: event.clientX, startY: event.clientY, frame: inputRef.current.frame, last: inputRef.current.frame };
      }
    };

    const follow = (event: MouseEvent): void => {
      const gesture = gestureRef.current;

      if (!gesture || !fresh(event)) {
        return;
      }

      const { viewport, onChange } = inputRef.current;
      const dx = (event.clientX - gesture.startX) / viewport.scale;
      const dy = (event.clientY - gesture.startY) / viewport.scale;
      const bounds = boundsOf(viewport);

      gesture.last =
        gesture.kind === 'move'
          ? moveFrame({ frame: gesture.frame, dx, dy, bounds })
          : resizeFrame({ frame: gesture.frame, dx, dy, edge: gesture.kind, bounds });

      reportOnce({ kind: 'mousemove', text: `${gesture.kind} by ${Math.round(dx)},${Math.round(dy)} rem` });
      onChange(gesture.last);
    };

    const finish = (event: MouseEvent): void => {
      const gesture = gestureRef.current;

      if (gesture) {
        gestureRef.current = null;
        reportOnce({ kind: 'mouseup', text: `${pointText(event)}, frame ${describeFrame(gesture.last)}` });
        inputRef.current.onDone(gesture.last);
      }
    };

    const { capture } = FRAME_GESTURE;

    document.addEventListener('mousedown', press, capture);
    document.addEventListener('mousemove', follow, capture);
    document.addEventListener('mouseup', finish, capture);
    window.addEventListener('mousedown', press);
    window.addEventListener('mousemove', follow);
    window.addEventListener('mouseup', finish);

    return () => {
      document.removeEventListener('mousedown', press, capture);
      document.removeEventListener('mousemove', follow, capture);
      document.removeEventListener('mouseup', finish, capture);
      window.removeEventListener('mousedown', press);
      window.removeEventListener('mousemove', follow);
      window.removeEventListener('mouseup', finish);
    };
  }, []);

  return { move: moveRef, corner: cornerRef, right: rightRef, bottom: bottomRef };
};
