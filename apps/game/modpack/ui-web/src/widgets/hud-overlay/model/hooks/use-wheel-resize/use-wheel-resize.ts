import type { UseWheelResizeInput } from './use-wheel-resize.types';

import { sendHud } from '../../../../../shared/api/hud-protocol';
import { rootScale } from '../../../../../shared/lib/hud-screen';
import { useWindowEvent } from '../../../../../shared/lib/use-window-event';
import { targetAt } from '../../../lib/hit-panel';
import { wheelScale } from '../../../lib/panel-size';

export const useWheelResize = ({ edit, targets, onScaled, report }: UseWheelResizeInput): void => {
  const resize = (event: WheelEvent): void => {
    const found = edit ? targetAt({ targets: targets(), press: event, scale: rootScale() }) : null;

    if (!found) {
      return;
    }

    event.preventDefault();
    report('wheel');

    const next = wheelScale({ current: found.scale, deltaY: event.deltaY });

    if (next !== found.scale) {
      onScaled({ id: found.id, scale: next });
      sendHud({ type: 'resized', id: found.id, scale: next });
    }
  };

  useWindowEvent({ type: 'wheel', handler: resize });
};
