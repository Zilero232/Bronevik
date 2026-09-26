'use client';

import { useLocale } from 'next-intl';

import { returnUrl } from '@/entities/auth/session';
import { resolveLocale } from '@/shared/i18n';
import { useHydrated } from '@/shared/lib';

import type { LestaStartUrlInput } from './use-lesta-start-url.types';

import { lestaStartUrl } from '../../../api';

export const useLestaStartUrl = ({ callbackPath, errorPath }: LestaStartUrlInput) => {
  const isHydrated = useHydrated();
  const locale = resolveLocale(useLocale());

  if (!isHydrated) {
    return undefined;
  }

  const { origin } = window.location;

  return lestaStartUrl({
    callbackURL: returnUrl({ path: callbackPath, locale, origin }),
    errorCallbackURL: errorPath ? returnUrl({ path: errorPath, locale, origin }) : undefined
  });
};
