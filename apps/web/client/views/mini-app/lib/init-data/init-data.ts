import { retrieveRawInitData } from '@tma.js/sdk-react';

export const readInitData = (): string | null => {
  try {
    return retrieveRawInitData() ?? null;
  } catch {
    return null;
  }
};
