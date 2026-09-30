import { useEffect, useState } from 'preact/hooks';

import type { Viewport } from '../../../lib/frame';

import { gameface } from '../../../../../shared/api/gameface';
import { reportOnce } from '../../../../../shared/lib/page-diag';
import { WINDOW_FRAME } from '../../../config';
import { describeViewport } from '../../../lib/describe';
import { readViewport, sameViewport } from '../../../lib/screen';

export const useViewport = (): Viewport => {
  const [viewport, setViewport] = useState<Viewport>(readViewport);

  useEffect(() => {
    const check = (): void => {
      const next = readViewport();

      setViewport((current) => {
        if (sameViewport(current, next)) {
          return current;
        }

        reportOnce({ kind: 'window viewport changed', text: describeViewport(next) });

        return next;
      });
    };

    const first = setTimeout(check, 0);
    const timer = setInterval(check, WINDOW_FRAME.screenCheckMs);

    window.addEventListener('resize', check);

    return () => {
      clearTimeout(first);
      clearInterval(timer);
      window.removeEventListener('resize', check);
    };
  }, []);

  useEffect(() => {
    gameface.setInputArea({ left: 0, top: 0, width: Math.round(viewport.view.width), height: Math.round(viewport.view.height) });
  }, [viewport]);

  return viewport;
};
