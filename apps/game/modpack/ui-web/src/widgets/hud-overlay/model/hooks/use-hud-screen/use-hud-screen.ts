import { useEffect, useState } from 'preact/hooks';

import type { ClientSize } from '../../../../../shared/api/gameface';

import { gameface } from '../../../../../shared/api/gameface';
import { HUD_OVERLAY } from '../../../config';
import { readScreen } from '../../../lib/overlay-screen';

export const useHudScreen = (): ClientSize => {
  const [screen, setScreen] = useState<ClientSize>(readScreen);

  useEffect(() => {
    const check = (): void => {
      const next = readScreen();

      setScreen((current) => {
        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        gameface.fitView();

        return next;
      });
    };

    const timer = setInterval(check, HUD_OVERLAY.screenCheckMs);

    window.addEventListener('resize', check);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', check);
    };
  }, []);

  return screen;
};
