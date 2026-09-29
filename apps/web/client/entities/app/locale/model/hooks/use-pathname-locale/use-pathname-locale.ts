'use client';

import type { Locale } from '@/shared/i18n';

import { DEFAULT_LOCALE } from '@/shared/i18n';
import { useHydrated } from '@/shared/lib';

import { pathnameLocale } from '../../../lib';

export const usePathnameLocale = (): Locale => (useHydrated() ? pathnameLocale(window.location.pathname) : DEFAULT_LOCALE);
