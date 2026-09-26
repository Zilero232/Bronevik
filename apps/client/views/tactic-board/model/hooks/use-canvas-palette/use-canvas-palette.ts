'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import type { CanvasPalette } from '../../../config';

import { CANVAS_FALLBACK } from '../../../config';
import { readCanvasPalette } from '../../../lib/canvas-palette';

export const useCanvasPalette = (): CanvasPalette => {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<CanvasPalette>(CANVAS_FALLBACK);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPalette(readCanvasPalette(getComputedStyle(document.documentElement))));

    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme]);

  return palette;
};
