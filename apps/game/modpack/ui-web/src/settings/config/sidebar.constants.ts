import type { StringKey } from '../../shared/i18n';

const GROUP_TITLES: Partial<Record<string, StringKey>> = { data: 'groupData', hangar: 'groupHangar', battle: 'groupBattle' };

export const SIDEBAR = {
  groupTitles: GROUP_TITLES,
  otherGroupTitle: 'groupOther'
} as const satisfies { groupTitles: Partial<Record<string, StringKey>>; otherGroupTitle: StringKey };
