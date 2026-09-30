import { useEffect, useRef } from 'preact/hooks';

import type { DragOfInput, ThumbDrag, ThumbPress, UseThumbDragInput } from './use-thumb-drag.types';

import { SCROLL_AREA } from '../../config';
import { scrollMetricsOf } from '../scroll-metrics';
import { thumbOf, topFromThumb } from '../wheel-scroll';

const dragOf = ({ element, clientY }: DragOfInput): ThumbDrag => {
  const { height } = element.getBoundingClientRect();
  const { offset } = thumbOf({ ...scrollMetricsOf(element), minThumb: SCROLL_AREA.minThumb });
  const factor = element.offsetHeight > 0 ? height / element.offsetHeight : 1;

  return { startY: clientY, startOffset: offset, factor };
};

export const useThumbDrag = ({ viewportRef, visible, onDragged }: UseThumbDragInput) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<ThumbDrag | null>(null);
  const draggedRef = useRef(onDragged);

  draggedRef.current = onDragged;

  const onThumbDown = (event: ThumbPress): void => {
    const element = viewportRef.current;

    event.preventDefault();
    event.stopPropagation();

    if (element) {
      dragRef.current = dragOf({ element, clientY: event.clientY });
    }
  };

  const thumbDownRef = useRef(onThumbDown);

  thumbDownRef.current = onThumbDown;

  useEffect(() => {
    const element = thumbRef.current;
    const listener = (event: MouseEvent): void => thumbDownRef.current(event);

    element?.addEventListener('mousedown', listener);

    return () => element?.removeEventListener('mousedown', listener);
  }, [visible]);

  useEffect(() => {
    const onMove = (event: MouseEvent): void => {
      const drag = dragRef.current;
      const element = viewportRef.current;

      if (!drag || !element) {
        return;
      }

      const current = scrollMetricsOf(element);
      const { size } = thumbOf({ ...current, minThumb: SCROLL_AREA.minThumb });
      const offset = drag.startOffset + (event.clientY - drag.startY) / drag.factor;

      element.scrollTop = topFromThumb({ ...current, size, offset });
      draggedRef.current();
    };

    const onUp = (): void => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [viewportRef]);

  return { thumbRef };
};
