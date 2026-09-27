import { useFormatter } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { parseLocalDateTime, useNavigation } from '@/shared/lib';

export const useClientOverview = () => {
  const format = useFormatter();
  const { navigate } = useNavigation();
  const { query, client, clientPath } = useSelectedClient();
  const { data: installation } = useInstallation(clientPath);
  const installedAt = parseLocalDateTime(installation?.installedAt ?? null);
  const components = installation?.components ?? [];

  return {
    clientsQuery: query,
    client: client ?? null,
    isInstalled: installation?.installed ?? false,
    modpackVersion: installation?.modpackVersion ?? null,
    installedAt: installedAt ? format.dateTime(installedAt, { dateStyle: 'medium', timeStyle: 'short' }) : null,
    enabledCount: components.filter((component) => component.state === 'enabled').length,
    totalCount: components.length,
    onInstall: () => navigate({ page: 'install' }),
    onOpenComponents: () => navigate({ page: 'components' })
  };
};
