import { useEffect, useRef } from 'preact/hooks';

import type { UseWindowEventInput } from './use-window-event.types';

export const useWindowEvent = <Type extends keyof WindowEventMap>({ type, handler }: UseWindowEventInput<Type>): void => {
  const handlerRef = useRef(handler);

  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event: WindowEventMap[Type]): void => handlerRef.current(event);

    window.addEventListener(type, listener, { passive: false });

    return () => window.removeEventListener(type, listener);
  }, [type]);
};
