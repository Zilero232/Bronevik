import type { GamefaceBridge } from '../../../../shared/api/gameface';
import type { Viewport } from '../../lib/frame';

import { gameface } from '../../../../shared/api/gameface';
import { designScreen, rootScale } from '../../../../shared/lib/hud-screen';
import { WINDOW_FRAME } from '../../config';

export const readViewport = (bridge: GamefaceBridge = gameface): Viewport => {
  const scale = bridge.remScale() ?? rootScale();
  const inner =
    window.innerWidth > 0 && window.innerHeight > 0
      ? { width: window.innerWidth / scale, height: window.innerHeight / scale }
      : WINDOW_FRAME.defaultScreen;

  const screen = bridge.clientSizeRem() ?? designScreen({ client: bridge.clientSize(), scale, fallback: inner });

  return { screen, view: bridge.viewRect() ?? { x: 0, y: 0, ...inner }, scale };
};

export const sameViewport = (a: Viewport, b: Viewport): boolean =>
  a.scale === b.scale &&
  a.screen.width === b.screen.width &&
  a.screen.height === b.screen.height &&
  a.view.x === b.view.x &&
  a.view.y === b.view.y &&
  a.view.width === b.view.width &&
  a.view.height === b.view.height;
