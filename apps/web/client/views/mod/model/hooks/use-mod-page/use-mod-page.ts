'use client';

import { useFormatter } from 'next-intl';

import type { ModpackAvailability } from '@/entities/mod/modpack-release';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { useModpackAvailability } from '@/entities/mod/modpack-release';
import { MOD_DISTRIBUTION } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

import type { ModDownload } from './use-mod-page.types';

import { MOD_PAGE } from '../../../config';

export const useModPage = () => {
  const { data: session, isPending } = useAuthSession();
  const loginHref = useLoginHref();
  const format = useFormatter();
  const availability = useModpackAvailability();

  const toDownload = (file: ModpackAvailability['manager']): ModDownload | null =>
    file && {
      version: file.version,
      size: format.number(file.size / MOD_PAGE.bytesPerMegabyte, { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 })
    };

  return {
    isSignedIn: Boolean(session),
    isSessionPending: isPending,
    bindHref: session ? ROUTES.account.overview : loginHref,
    distribution: MOD_DISTRIBUTION,
    downloads: {
      isPreparing: !availability.isPending && !availability.isPublished,
      manager: toDownload(availability.manager),
      modpack: toDownload(availability.modpack)
    }
  };
};
