'use client';

import { useCopy } from '@siberiacancode/reactuse';

export const useChallengeCode = (code: string) => {
  const { copied, copy } = useCopy();

  const onCopy = () => void copy(code);

  return { copied, onCopy };
};
