import { useStore } from '@nanostores/preact';

import { $groups, $selected, $view, openComponent, openSection, SECTION, toggleSwitch } from '../../../../../entities/window-state';
import { SIDEBAR } from '../../../config';

export const useSidebar = () => {
  const groups = useStore($groups);
  const view = useStore($view);
  const selected = useStore($selected);

  return {
    groups: groups.map((group) => ({
      id: group.id,
      titleKey: SIDEBAR.groupTitles[group.id] ?? SIDEBAR.otherGroupTitle,
      items: group.components.map((component) => ({
        component,
        active: view.section === SECTION.components && selected?.id === component.id,
        open: () => openComponent(component.id),
        toggle: () => toggleSwitch(component)
      }))
    })),
    links: SIDEBAR.links.map((link) => ({ ...link, active: view.section === link.section, open: () => openSection(link.section) }))
  };
};
