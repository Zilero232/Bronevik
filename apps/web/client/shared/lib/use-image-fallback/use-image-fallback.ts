'use client';

import { useBoolean } from '@siberiacancode/reactuse';

export const useImageFallback = (src: string | null) => {
  const [hasFailed, setFailed] = useBoolean(false);

  return { image: hasFailed ? null : src, onError: () => setFailed(true) };
};
