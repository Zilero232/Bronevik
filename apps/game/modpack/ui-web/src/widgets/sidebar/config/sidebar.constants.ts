import type { Section } from '../../../entities/window-state';
import type { StringKey } from '../../../shared/i18n';

import { SECTION } from '../../../entities/window-state';

const GROUP_TITLES: Partial<Record<string, StringKey>> = { data: 'groupData', hangar: 'groupHangar', battle: 'groupBattle' };

export const SIDEBAR = {
  groupTitles: GROUP_TITLES,
  otherGroupTitle: 'groupOther',
  links: [
    { section: SECTION.profiles, label: 'sectionProfiles' },
    { section: SECTION.hud, label: 'sectionHud' }
  ]
} as const satisfies {
  groupTitles: Partial<Record<string, StringKey>>;
  otherGroupTitle: StringKey;
  links: readonly { section: Section; label: StringKey }[];
};
