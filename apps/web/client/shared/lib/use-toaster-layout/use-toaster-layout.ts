'use client';

import type { ToasterProps } from 'sonner';

import { useMediaQuery } from '@siberiacancode/reactuse';
import { useTheme } from 'next-themes';

import { TOASTER_LAYOUT } from './use-toaster-layout.constants';

export const useToasterLayout = (): Pick<ToasterProps, 'closeButton' | 'position' | 'theme'> => {
  const { resolvedTheme } = useTheme();
  const isCompact = useMediaQuery(TOASTER_LAYOUT.compactQuery);

  return {
    closeButton: isCompact,
    position: isCompact ? TOASTER_LAYOUT.position.compact : TOASTER_LAYOUT.position.wide,
    theme: resolvedTheme === 'light' ? 'light' : 'dark'
  };
};
