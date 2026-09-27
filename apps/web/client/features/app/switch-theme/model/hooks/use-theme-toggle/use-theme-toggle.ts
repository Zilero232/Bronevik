'use client';

import { useTheme } from 'next-themes';

import { useHydrated } from '@/shared/lib';

export const useThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isHydrated = useHydrated();

  const isLight = isHydrated && resolvedTheme === 'light';

  return { isLight, toggle: () => setTheme(isLight ? 'dark' : 'light') };
};
