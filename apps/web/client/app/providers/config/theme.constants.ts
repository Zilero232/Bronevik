import type { ThemeProviderProps } from 'next-themes';

import { isBrowser } from '@/shared/lib';

export const THEME_SCRIPT_PROPS: ThemeProviderProps['scriptProps'] = isBrowser() ? { type: 'application/json' } : undefined;
