import type { ClientSize } from '../../../../shared/api/gameface';

import { gameface } from '../../../../shared/api/gameface';
import { designScreen, rootScale } from '../../../../shared/lib/hud-screen';
import { WINDOW_FRAME } from '../../config';

export const readScreen = (): ClientSize => {
  const scale = rootScale();
  const fallback =
    window.innerWidth > 0 && window.innerHeight > 0
      ? { width: window.innerWidth / scale, height: window.innerHeight / scale }
      : WINDOW_FRAME.defaultScreen;

  return designScreen({ client: gameface.clientSize(), scale, fallback });
};
