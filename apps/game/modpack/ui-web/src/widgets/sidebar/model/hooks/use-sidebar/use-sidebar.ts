import { useStore } from '@nanostores/preact';

import type { Section } from '../../../../../entities/window-state';

import { $query, $summaries, $view, openSection, SECTION_ICONS, SECTION_NAV, SECTION_TEXT } from '../../../../../entities/window-state';

export const useSidebar = () => {
  const view = useStore($view);
  const query = useStore($query);
  const summaries = useStore($summaries);
  const searching = query.trim().length > 0;

  const item = (section: Section) => {
    const summary = summaries.find((entry) => entry.section === section);

    return {
      section,
      icon: SECTION_ICONS[section],
      labelKey: SECTION_TEXT[section].title,
      count: summary && summary.total > 0 ? `${summary.enabled}/${summary.total}` : null,
      active: !searching && view.section === section,
      open: () => openSection(section)
    };
  };

  return { components: SECTION_NAV.components.map(item), tools: SECTION_NAV.tools.map(item) };
};
