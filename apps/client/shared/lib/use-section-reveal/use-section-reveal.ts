'use client';

import { useEffect, useRef } from 'react';

const REVEAL = {
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
  rootMargin: '0px 0px -8% 0px'
} as const;

export const useSectionReveal = <E extends HTMLElement>() => {
  const ref = useRef<E>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || window.matchMedia(REVEAL.reducedMotionQuery).matches || element.getBoundingClientRect().top < window.innerHeight) {
      return;
    }

    element.dataset.reveal = 'pending';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.reveal = 'shown';
          observer.disconnect();
        }
      },
      { rootMargin: REVEAL.rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      delete element.dataset.reveal;
    };
  }, []);

  return ref;
};
