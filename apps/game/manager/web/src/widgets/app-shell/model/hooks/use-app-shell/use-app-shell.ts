import { useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { usePatchReport } from '@/entities/patch-report';
import { NAV_PAGE_IDS } from '@/shared/config';
import { useNavigation } from '@/shared/lib';

import { NAV_ICONS } from '../../../config';

export const useAppShell = () => {
  const t = useTranslations('nav');
  const { page, navigate } = useNavigation();
  const { client } = useSelectedClient();
  const { data: report } = usePatchReport();
  const activePage = page === 'install' ? 'home' : page;

  return {
    items: NAV_PAGE_IDS.map((id) => ({
      id,
      label: t(id),
      icon: NAV_ICONS[id],
      isActive: id === activePage,
      onSelect: () => navigate({ page: id })
    })),
    clientVersion: client?.version ?? null,
    statusKind: report?.status.kind ?? null
  };
};
