'use client';

import { useState } from 'react';
import { isNonNullish } from 'remeda';

export const useImageFallback = (sources: readonly (string | null | undefined)[]) => {
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());

  const image = sources.filter(isNonNullish).find((source) => !failed.has(source)) ?? null;

  return { image, onError: () => image && setFailed((current) => new Set([...current, image])) };
};
