import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import type { ScrollMetrics } from '../wheel-scroll';
import type { ThumbDrag, ThumbPress } from './use-scroll-area.types';

import { SCROLL_AREA, WHEEL_SCROLL_PROPS } from '../../config';
import { thumbOf, topFromThumb } from '../wheel-scroll';

const EMPTY: ScrollMetrics = { top: 0, content: 0, viewport: 0 };

const metricsOf = (element: HTMLElement): ScrollMetrics => ({
  top: element.scrollTop,
  content: element.scrollHeight,
  viewport: element.clientHeight
});

const sameMetrics = (a: ScrollMetrics, b: ScrollMetrics): boolean => a.top === b.top && a.content === b.content && a.viewport === b.viewport;

export const useScrollArea = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<ThumbDrag | null>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>(EMPTY);

  const measureRef = useRef(() => {
    const element = viewportRef.current;

    if (element) {
      const next = metricsOf(element);

      setMetrics((current) => (sameMetrics(current, next) ? current : next));
    }
  });

  const onThumbDown = (event: ThumbPress): void => {
    const element = viewportRef.current;

    event.preventDefault();
    event.stopPropagation();

    if (element) {
      const { height } = element.getBoundingClientRect();
      const offset = thumbOf({ ...metricsOf(element), minThumb: SCROLL_AREA.minThumb }).offset;

      dragRef.current = { startY: event.clientY, startOffset: offset, factor: element.offsetHeight > 0 ? height / element.offsetHeight : 1 };
    }
  };

  const thumbDownRef = useRef(onThumbDown);

  thumbDownRef.current = onThumbDown;

  useLayoutEffect(() => {
    measureRef.current();
  });

  useEffect(() => {
    const element = viewportRef.current;
    const listener = (): void => measureRef.current();

    element?.addEventListener('scroll', listener);

    return () => element?.removeEventListener('scroll', listener);
  }, []);

  const thumb = thumbOf({ ...metrics, minThumb: SCROLL_AREA.minThumb });

  useEffect(() => {
    const element = thumbRef.current;
    const listener = (event: MouseEvent): void => thumbDownRef.current(event);

    element?.addEventListener('mousedown', listener);

    return () => element?.removeEventListener('mousedown', listener);
  }, [thumb.visible]);

  useEffect(() => {
    const timer = setInterval(() => measureRef.current(), SCROLL_AREA.measureMs);

    const onMove = (event: MouseEvent): void => {
      const drag = dragRef.current;
      const element = viewportRef.current;

      if (!drag || !element) {
        return;
      }

      const current = metricsOf(element);
      const { size } = thumbOf({ ...current, minThumb: SCROLL_AREA.minThumb });

      element.scrollTop = topFromThumb({ ...current, size, offset: drag.startOffset + (event.clientY - drag.startY) / drag.factor });
      measureRef.current();
    };

    const onUp = (): void => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return {
    viewportRef,
    thumb,
    thumbStyle: { height: `${thumb.size}px`, top: `${thumb.offset}px` },
    thumbRef,
    viewportProps: WHEEL_SCROLL_PROPS,
    onThumbDown
  };
};
