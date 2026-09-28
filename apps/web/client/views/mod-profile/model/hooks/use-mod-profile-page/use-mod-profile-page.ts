'use client';

import { parseProfileCode } from '@/features/mod/open-in-manager';
import { useLocationHash } from '@/shared/lib';

import type { ModProfilePageState } from './use-mod-profile-page.types';

export const useModProfilePage = (): ModProfilePageState => {
  const hash = useLocationHash();

  if (hash === null) {
    return { status: 'pending' };
  }

  const code = parseProfileCode(hash);

  return code ? { status: 'ready', code } : { status: 'missing' };
};
