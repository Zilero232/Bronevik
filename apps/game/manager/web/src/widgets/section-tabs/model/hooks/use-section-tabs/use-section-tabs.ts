import { useTranslations } from 'use-intl';

import { PAGE_SECTIONS } from '@/shared/config';
import { useNavigation } from '@/shared/lib';

import type { UseSectionTabsInput } from './use-section-tabs.types';

export const useSectionTabs = ({ section }: UseSectionTabsInput) => {
  const t = useTranslations('nav.tabs');
  const { page, navigate } = useNavigation();
  const { pages } = PAGE_SECTIONS[section];

  return {
    label: t('label'),
    chips: pages.map((id) => ({ value: id, label: t(id) })),
    value: page,
    onChange: (value: string) => {
      const target = pages.find((id) => id === value);

      if (target) {
        navigate({ page: target });
      }
    }
  };
};
