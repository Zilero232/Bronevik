import type { PointerEvent } from 'react';

import { TILT } from './tilt.constants';

const onPointerMove = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType !== 'mouse') {
    return;
  }

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  target.style.setProperty('--tilt-x', `${(x * TILT.maxDegrees * 2).toFixed(2)}deg`);
  target.style.setProperty('--tilt-y', `${(-y * TILT.maxDegrees * 2).toFixed(2)}deg`);
};

const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
  event.currentTarget.style.removeProperty('--tilt-x');
  event.currentTarget.style.removeProperty('--tilt-y');
};

export const TILT_HANDLERS = { onPointerMove, onPointerLeave } as const;
