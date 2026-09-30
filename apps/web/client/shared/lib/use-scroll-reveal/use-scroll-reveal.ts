'use client';

import { inView } from 'motion';
import { useEffect, useRef } from 'react';

import { SCROLL_REVEAL } from './use-scroll-reveal.constants';

export const useScrollReveal = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || element.getBoundingClientRect().top < window.innerHeight) {
      return;
    }

    element.dataset.reveal = SCROLL_REVEAL.hidden;

    return inView(
      element,
      () => {
        element.dataset.reveal = SCROLL_REVEAL.shown;
      },
      { amount: SCROLL_REVEAL.amount }
    );
  }, []);

  return ref;
};
