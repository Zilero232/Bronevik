'use client';

import { useCommandPalette } from '../../context';

export const useCommandPaletteTrigger = (onOpen?: () => void) => {
  const { setOpen } = useCommandPalette();

  return () => {
    onOpen?.();
    setOpen(true);
  };
};
