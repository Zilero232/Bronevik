import { useLocale, useTranslations } from 'use-intl';

import { useCatalog } from '@/entities/catalog';
import { useSelectedClient } from '@/entities/client';
import { useGameHealth } from '@/entities/game-health';
import { useInstallation } from '@/entities/installation';
import { pickLocalized } from '@/shared/lib';

export const useGameHealthCard = () => {
  const t = useTranslations('health');
  const locale = useLocale();
  const { clientPath } = useSelectedClient();
  const { data: health } = useGameHealth(clientPath);
  const { data: catalog } = useCatalog();
  const { data: installation } = useInstallation(clientPath);
  const failures = health && !health.stale ? health.failures : [];

  return {
    clientPath,
    isVisible: failures.length > 0,
    title: t('title', { count: failures.length }),
    rows: failures.map((failure) => {
      const component = catalog?.components.find((item) => item.id === failure.component);
      const state = installation?.components.find((item) => item.id === failure.component)?.state ?? 'missing';
      const title = component ? pickLocalized({ text: component.title, locale }) : failure.component;

      return {
        id: failure.component,
        title,
        message: t('failed', { title }),
        hint: t(`kinds.${failure.kind}`),
        source: t(`sources.${failure.source}`),
        excerpt: failure.excerpt,
        canToggle: state !== 'missing' && !(component?.required ?? false),
        checked: state === 'enabled'
      };
    })
  };
};
