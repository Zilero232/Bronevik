'use client';

import { useId } from 'react';

const UNSAFE = /[^\w-]/g;

export const useSvgId = (prefix: string) => {
  const id = useId();

  return `${prefix}-${id.replace(UNSAFE, '')}`;
};
