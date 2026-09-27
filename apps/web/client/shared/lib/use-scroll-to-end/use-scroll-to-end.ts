'use client';

import { useEffect, useRef } from 'react';

export const useScrollToEnd = <T extends HTMLElement>(key: unknown) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.scrollLeft = node.scrollWidth;
    }
  }, [key]);

  return ref;
};
