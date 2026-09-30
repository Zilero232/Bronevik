import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import type { UseVirtualListInput } from './use-virtual-list.types';

import { useWheelScroll } from '../../../../../shared/lib/use-wheel-scroll';
import { REPLAYS_BROWSER } from '../../../config';
import { visibleRange } from '../../../lib/visible-range';

export const useVirtualList = ({ count, rowHeight, overscan }: UseVirtualListInput) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const totalRef = useRef(count * rowHeight);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState<number>(REPLAYS_BROWSER.fallbackViewport);

  totalRef.current = count * rowHeight;

  const pixelsPerUnit = useCallback((): number => {
    const drawn = canvasRef.current?.offsetHeight ?? 0;

    return drawn > 0 && totalRef.current > 0 ? drawn / totalRef.current : 1;
  }, []);

  const measure = useCallback((): void => {
    const height = viewportRef.current?.clientHeight;

    if (height) {
      setViewport(height / pixelsPerUnit());
    }
  }, [pixelsPerUnit]);

  const sync = useCallback((): void => {
    const node = viewportRef.current;

    if (node) {
      setScrollTop(node.scrollTop / pixelsPerUnit());
      measure();
    }
  }, [measure, pixelsPerUnit]);

  const wheelRef = useWheelScroll({ onScrolled: sync });

  const attach = useCallback(
    (node: HTMLDivElement | null): void => {
      viewportRef.current = node;
      wheelRef(node);
      measure();
    },
    [measure, wheelRef]
  );

  useEffect(() => {
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const toTop = useCallback((): void => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }

    setScrollTop(0);
  }, []);

  return {
    ref: attach,
    canvasRef,
    ...visibleRange({ scrollTop, viewport, rowHeight, count, overscan }),
    onScroll: sync,
    toTop
  };
};
