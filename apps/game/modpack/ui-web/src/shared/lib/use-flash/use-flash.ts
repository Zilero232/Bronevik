import { useEffect, useState } from 'react';

import { FLASH } from './use-flash.constants';

export const useFlash = (key: string): boolean => {
  const [settled, setSettled] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(setSettled, FLASH.ms, key);

    return () => clearTimeout(timer);
  }, [key]);

  return settled !== key;
};
