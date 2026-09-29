import { ToggleChips } from '@/ui-kit';

import type { SectionTabsProps } from './SectionTabs.types';

import { useSectionTabs } from '../model/hooks';

export const SectionTabs = ({ section }: SectionTabsProps) => {
  const { label, chips, value, onChange } = useSectionTabs({ section });

  return <ToggleChips chips={chips} label={label} value={value} onChange={onChange} />;
};
