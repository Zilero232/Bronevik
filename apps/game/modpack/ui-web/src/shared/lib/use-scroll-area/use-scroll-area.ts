import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { funnel, isDeepEqual } from 'remeda';

import type { ScrollMetrics } from '../scroll-metrics';
import type { UseScrollAreaInput } from './use-scroll-area.types';

import { SCROLL_AREA } from '../../config';
import { scrollMetricsOf } from '../scroll-metrics';
import { useThumbDrag } from '../use-thumb-drag';
import { bindWheelScroll, thumbOf } from '../wheel-scroll';

export const useScrollArea = ({ initialTop = 0, onScrollEnd }: UseScrollAreaInput = {}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollEndRef = useRef(onScrollEnd);
  const [metrics, setMetrics] = useState<ScrollMetrics>(SCROLL_AREA.emptyMetrics);

  scrollEndRef.current = onScrollEnd;

  const measureRef = useRef(() => {
    const element = viewportRef.current;

    if (element) {
      const next = scrollMetricsOf(element);

      setMetrics((current) => (isDeepEqual(current, next) ? current : next));
    }
  });

  const scrolledRef = useRef(() => measureRef.current());
  const thumb = thumbOf({ ...metrics, minThumb: SCROLL_AREA.minThumb });
  const drag = useThumbDrag({ viewportRef, visible: thumb.visible, onDragged: () => scrolledRef.current() });

  useLayoutEffect(() => {
    measureRef.current();
  });

  useEffect(() => {
    const timer = setInterval(() => measureRef.current(), SCROLL_AREA.measureMs);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return undefined;
    }

    element.scrollTop = initialTop;

    const settled = funnel(() => scrollEndRef.current?.(element.scrollTop), { minQuietPeriodMs: SCROLL_AREA.settleMs, triggerAt: 'end' });

    scrolledRef.current = () => {
      measureRef.current();
      settled.call();
    };

    const listener = (): void => scrolledRef.current();
    const unbindWheel = bindWheelScroll({ element, onScrolled: listener });

    element.addEventListener('scroll', listener);

    return () => {
      settled.flush();
      unbindWheel();
      element.removeEventListener('scroll', listener);
    };
  }, [initialTop]);

  return {
    viewportRef,
    thumb,
    thumbStyle: { height: `${thumb.size}px`, top: `${thumb.offset}px` },
    thumbRef: drag.thumbRef
  };
};
