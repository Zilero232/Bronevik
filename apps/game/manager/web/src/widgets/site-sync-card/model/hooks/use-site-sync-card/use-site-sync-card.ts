import { useState } from 'react';
import { useTranslations } from 'use-intl';

import { useAccountLink } from '@/entities/account-link';
import { useSelectedClient } from '@/entities/client';
import { SITE_SYNC, useSyncStatus } from '@/entities/site-sync';
import { fromUnixSeconds, useDisplayFormat } from '@/shared/lib';

export const useSiteSyncCard = () => {
  const t = useTranslations('sync');
  const { stamp } = useDisplayFormat();
  const { clientPath } = useSelectedClient();
  const linkQuery = useAccountLink();
  const { data: status } = useSyncStatus(clientPath);
  const [isLinking, setIsLinking] = useState(false);
  const accounts = linkQuery.data?.accounts ?? [];
  const selected = linkQuery.data?.selected ?? null;
  const isLinked = accounts.length > 0;

  return {
    linkQuery,
    isLinked,
    hasChoice: accounts.length > 1,
    account: selected === null ? null : t('accountOption', { id: selected }),
    isLinkFormOpen: !isLinked || isLinking,
    lines: SITE_SYNC.libraries.flatMap((library) => {
      const local = status?.[library];

      if (!local) {
        return [];
      }

      const synced = fromUnixSeconds(local.syncedAt);

      return [
        {
          library,
          label: t(`libraries.${library}`),
          text: synced ? t('syncedAt', { date: stamp(synced) }) : t('neverSynced'),
          pending: local.pending > 0 ? t('pending', { count: local.pending }) : null
        }
      ];
    }),
    onToggleLinkForm: () => setIsLinking((current) => !current)
  };
};
