'use client';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

import { APP_TOASTER } from './AppToaster.constants';

export const AppToaster = () => {
  const { resolvedTheme } = useTheme();
  const isCompact = useMediaQuery(APP_TOASTER.compactQuery);

  return (
    <Toaster
      className='otmetki-toaster'
      closeButton={isCompact}
      gap={APP_TOASTER.gap}
      mobileOffset={APP_TOASTER.mobileOffset}
      position={isCompact ? 'top-center' : 'bottom-right'}
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
    />
  );
};
