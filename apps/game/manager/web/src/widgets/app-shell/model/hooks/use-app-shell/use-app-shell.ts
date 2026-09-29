import { useTranslations } from 'use-intl';

import type { PageId } from '@/shared/lib';

import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { statusView, usePatchReport } from '@/entities/patch-report';
import { PAGE_SECTIONS } from '@/shared/config';
import { useNavigation } from '@/shared/lib';

import { NAV_GROUPS, NAV_ICONS } from '../../../config';
import { navMarker } from '../../../lib';

export const useAppShell = () => {
  const t = useTranslations('nav');
  const { page, navigate } = useNavigation();
  const { client, clientPath } = useSelectedClient();
  const { data: installation } = useInstallation(clientPath);
  const { data: report } = usePatchReport();
  const isInstalled = installation?.installed ?? false;
  const view = report ? statusView({ status: report.status, needsMigration: installation?.needsMigration ?? false }) : null;
  const canInstall = client !== undefined && client.problem === null && !isInstalled;

  return {
    groups: NAV_GROUPS.map((group) => ({
      id: group.id,
      label: t(`groups.${group.id}`),
      items: group.sections.map((id) => {
        const pages: readonly PageId[] = PAGE_SECTIONS[id].pages;

        return {
          id,
          label: t(`sections.${id}`),
          icon: NAV_ICONS[id],
          isActive: pages.includes(page),
          marker: navMarker({ section: id, view, canInstall }),
          onSelect: () => navigate({ page: id })
        };
      })
    })),
    gameVersion: client?.version ?? null,
    modpackVersion: isInstalled ? (installation?.modpackVersion ?? null) : null,
    tone: view?.tone ?? 'neutral'
  };
};
