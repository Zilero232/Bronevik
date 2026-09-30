import { useEffect, useEffectEvent } from 'react';

import type { PageMouseHandlers, PickHandler } from './use-page-mouse.types';

import { FRAME_GESTURE } from '../../../config';

export const usePageMouse = (handlers: PageMouseHandlers): void => {
  const current = useEffectEvent(() => handlers);

  useEffect(() => {
    let last: Event | null = null;

    const once =
      (pick: PickHandler) =>
      (event: MouseEvent): void => {
        if (last === event) {
          return;
        }

        last = event;
        pick(current())(event);
      };

    const press = once(({ onPress }) => onPress);
    const follow = once(({ onMove }) => onMove);
    const finish = once(({ onRelease }) => onRelease);
    const { capture } = FRAME_GESTURE;

    document.addEventListener('mousedown', press, capture);
    document.addEventListener('mousemove', follow, capture);
    document.addEventListener('mouseup', finish, capture);
    window.addEventListener('mousedown', press);
    window.addEventListener('mousemove', follow);
    window.addEventListener('mouseup', finish);

    return () => {
      document.removeEventListener('mousedown', press, capture);
      document.removeEventListener('mousemove', follow, capture);
      document.removeEventListener('mouseup', finish, capture);
      window.removeEventListener('mousedown', press);
      window.removeEventListener('mousemove', follow);
      window.removeEventListener('mouseup', finish);
    };
  }, []);
};
