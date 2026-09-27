'use client';

import { useSyncExternalStore } from 'react';

import type { Locale } from '@/shared/i18n';

import { DEFAULT_LOCALE } from '@/shared/i18n';

import { pathnameLocale } from '../../../lib';

const subscribe = () => () => {};

export const usePathnameLocale = (): Locale =>
  useSyncExternalStore(
    subscribe,
    () => pathnameLocale(window.location.pathname),
    () => DEFAULT_LOCALE
  );
