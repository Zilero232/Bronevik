import { useInterval, useWindowEvent } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { ClientSize } from '../../../../../shared/api/gameface';

import { gameface } from '../../../../../shared/api/gameface';
import { HUD_OVERLAY } from '../../../config';
import { readScreen } from '../../../lib/overlay-screen';

export const useHudScreen = (): ClientSize => {
  const [screen, setScreen] = useState<ClientSize>(readScreen);

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

  useInterval(check, HUD_OVERLAY.screenCheckMs);
  useWindowEvent('resize', check);

  return screen;
};
