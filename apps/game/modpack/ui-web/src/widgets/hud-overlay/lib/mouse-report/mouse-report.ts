import type { HudMouseEvent } from './mouse-report.types';

import { sendHud } from '../../../../shared/api/hud-protocol';

export const createMouseReport = () => {
  const seen = new Set<HudMouseEvent>();

  return (event: HudMouseEvent): void => {
    if (!seen.has(event)) {
      seen.add(event);
      sendHud({ type: 'mouse', event });
    }
  };
};
