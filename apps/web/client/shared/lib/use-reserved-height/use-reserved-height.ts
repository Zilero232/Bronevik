'use client';

import { useState } from 'react';

import { childrenHeight } from '../children-height';

export const useReservedHeight = () => {
  const [reservedHeight, setReservedHeight] = useState<number | null>(null);

  const measureRef = (node: HTMLElement | null) => {
    const height = node === null ? 0 : childrenHeight(node);

    if (height > 0) {
      setReservedHeight(height);
    }
  };

  return { reservedHeight, reservedStyle: reservedHeight === null ? undefined : { minHeight: reservedHeight }, measureRef };
};
