import { useState } from 'react';

import type { MediaSource } from './use-media-source.types';

export const useMediaSource = (src: string | null): MediaSource => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const usable = src !== null && src !== failedSrc ? src : null;

  return {
    src: usable,
    isLoaded: usable !== null && usable === loadedSrc,
    onLoad: () => setLoadedSrc(src),
    onError: () => setFailedSrc(src)
  };
};
